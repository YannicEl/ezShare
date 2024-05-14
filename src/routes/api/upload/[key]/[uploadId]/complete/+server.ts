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

export const POST = defineRequestHandler({ schema }, async ({ platform, params, data }) => {
	const bucket = platform?.env.BUCKET!;

	const { key, uploadId } = params;

	const multipartUpload = await bucket.resumeMultipartUpload(key, uploadId);

	await multipartUpload.complete(data.uploadedParts);

	return Response.json({ success: true });
});
