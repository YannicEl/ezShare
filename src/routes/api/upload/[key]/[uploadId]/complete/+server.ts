import type { RequestHandler } from '@sveltejs/kit';
import { z } from 'zod';

const schema = z.object({
	uploadedParts: z.array(
		z.object({
			partNumber: z.number(),
			etag: z.string(),
		})
	),
});

export const POST: RequestHandler = async ({ platform, request, params }) => {
	const bucket = platform?.env.BUCKET!;

	const { key, uploadId } = params;
	const { uploadedParts } = schema.parse(await request.json());

	const multipartUpload = await bucket.resumeMultipartUpload(key, uploadId);

	await multipartUpload.complete(uploadedParts);

	return Response.json({ success: true });
};
