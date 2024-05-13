import type { RequestHandler } from '@sveltejs/kit';

export const PUT: RequestHandler = async ({ platform, request, params }) => {
	const bucket = platform?.env.BUCKET!;

	const { key, uploadId, partNumber } = params;

	const multipartUpload = await bucket.resumeMultipartUpload(key, uploadId);

	const body = await request.blob();
	if (!body) return new Response('No Body', { status: 404 });

	const uploadPart = await multipartUpload.uploadPart(Number(partNumber), body);

	return Response.json(uploadPart);
};
