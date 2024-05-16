import { defineRequestHandler } from '$lib/server/handlers/requestHandler';

export const DELETE = defineRequestHandler({}, async ({ params, locals: { bucket } }) => {
	const { publicId, key, uploadId } = params;
	const multipartUpload = await bucket.resumeMultipartUpload(`${publicId}/${key}`, uploadId);

	await multipartUpload.abort();

	return Response.json({ success: true });
});
