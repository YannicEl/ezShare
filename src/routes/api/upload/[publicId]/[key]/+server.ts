import { defineRequestHandler } from '$lib/server/handlers/requestHandler';

export const POST = defineRequestHandler({}, async ({ params, locals: { bucket } }) => {
	const { publicId, key } = params;
	const { uploadId } = await bucket.createMultipartUpload(`${publicId}/${key}`);

	return Response.json({ key, uploadId });
});
