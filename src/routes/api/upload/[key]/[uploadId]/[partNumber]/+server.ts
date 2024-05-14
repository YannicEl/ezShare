import { defineRequestHandler } from '$lib/server/handlers/requestHandler';
import { error } from '@sveltejs/kit';

export const PUT = defineRequestHandler({}, async ({ platform, request, params }) => {
	const bucket = platform?.env.BUCKET!;

	const { key, uploadId, partNumber } = params;

	const multipartUpload = await bucket.resumeMultipartUpload(key, uploadId);

	const body = await request.blob();
	if (!body) error(404, { message: 'No Body' });

	const uploadPart = await multipartUpload.uploadPart(Number(partNumber), body);

	return Response.json(uploadPart);
});
