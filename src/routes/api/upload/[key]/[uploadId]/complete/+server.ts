import { defineRequestHandler } from '$lib/server/handlers/requestHandler';
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
	async ({ params, data, locals: { bucket } }) => {
		const { key, uploadId } = params;

		const multipartUpload = await bucket.resumeMultipartUpload(key, uploadId);

		await multipartUpload.complete(data.uploadedParts);

		return Response.json({ success: true });
	}
);
