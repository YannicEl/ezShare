import { defineRequestHandler } from '$lib/server/handlers/requestHandler';

export const POST = defineRequestHandler({}, async ({ params, locals: { bucket } }) => {
	const { key } = params;
	const { uploadId } = await bucket.createMultipartUpload(key);

	return Response.json({ key, uploadId });
});

export const DELETE = defineRequestHandler({}, async ({ params, locals: { bucket } }) => {
	const { key, uploadId } = params;
	const multipartUpload = await bucket.resumeMultipartUpload(key, uploadId);

	await multipartUpload.abort();

	return Response.json({ success: true });
});
