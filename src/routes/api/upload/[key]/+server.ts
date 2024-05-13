import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ platform, params }) => {
	const bucket = platform?.env.BUCKET!;

	const { key } = params;
	const { uploadId } = await bucket.createMultipartUpload(key);

	return Response.json({ key, uploadId });
};

export const DELETE: RequestHandler = async ({ platform, params }) => {
	const bucket = platform?.env.BUCKET!;

	const { key, uploadId } = params;
	const multipartUpload = await bucket.resumeMultipartUpload(key, uploadId);

	await multipartUpload.abort();

	return Response.json({ success: true });
};
