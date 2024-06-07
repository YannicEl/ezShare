import { getUploadByPublicId, insertFile } from '$lib/server/db';
import { validateJsonData } from '$lib/server/validation';
import { error } from '@sveltejs/kit';
import { z } from 'zod';

const schema = z.object({
	uploadedParts: z.array(
		z.object({
			partNumber: z.number(),
			etag: z.string(),
		})
	),
});

const metadataSchema = z.object({
	filename: z.string(),
	fileId: z.string(),
	publicId: z.string(),
});

export const POST = async ({ request, params, locals: { db, bucket } }) => {
	const data = await validateJsonData(schema, request);

	const { publicId, key, uploadId } = params;
	const multipartUpload = bucket.resumeMultipartUpload(`${publicId}/${key}`, uploadId);

	await multipartUpload.complete(data.uploadedParts);

	// TODO Only needed because multipartUpload retruns empty metadata object
	const r2Object = await bucket.head(`${publicId}/${key}`);
	if (!r2Object) error(404, 'Object not found');

	const { filename, fileId } = metadataSchema.parse(r2Object.customMetadata);

	const upload = await getUploadByPublicId(db, publicId);
	if (!upload) error(404, 'Upload not found');

	await insertFile(db, {
		publicId: fileId,
		uploadId: upload.id,
		name: filename,
		size: r2Object.size,
	});

	return Response.json({ success: true });
};
