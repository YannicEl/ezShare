import { getRandomId } from '$lib/random';
import { getUploadByPublicId, insertFile } from '$lib/server/db';
import { validateJsonData } from '$lib/server/validation';
import { error } from '@sveltejs/kit';
import { z } from 'zod';
import type { RequestHandler } from './$types';

const schema = z.object({
	uploadedParts: z.array(
		z.object({
			partNumber: z.number(),
			etag: z.string(),
		})
	),
});

export const POST: RequestHandler = async ({ request, params, locals: { db, bucket } }) => {
	const data = await validateJsonData(schema, request);

	const { publicId, key, uploadId } = params;
	const multipartUpload = bucket.resumeMultipartUpload(`${publicId}/${key}`, uploadId);

	const r2Object = await multipartUpload.complete(data.uploadedParts);
	const [_, name] = r2Object.key.split('/');

	const upload = await getUploadByPublicId(db, publicId);
	if (!upload) error(404, 'Upload not found');

	await insertFile(db, {
		publicId: getRandomId(),
		uploadId: upload.id,
		name,
		size: r2Object.size,
	});

	return Response.json({ success: true });
};
