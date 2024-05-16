import { getUploadByPublicId, insertFile } from '$lib/server/db';
import { defineRequestHandler } from '$lib/server/handlers/requestHandler';
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

export const POST = defineRequestHandler(
	{ schema },
	async ({ params, data, locals: { db, bucket } }) => {
		const { publicId, key, uploadId } = params;
		const multipartUpload = await bucket.resumeMultipartUpload(`${publicId}/${key}`, uploadId);

		const r2Object = await multipartUpload.complete(data.uploadedParts);
		const [_, name] = r2Object.key.split('/');

		const upload = await getUploadByPublicId(db, publicId);
		if (!upload) error(404, 'Upload not found');

		await insertFile(db, {
			uploadId: upload.id,
			name,
			size: r2Object.size,
		});

		return Response.json({ success: true });
	}
);
