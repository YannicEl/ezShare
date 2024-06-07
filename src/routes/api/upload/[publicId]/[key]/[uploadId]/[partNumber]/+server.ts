import { error } from '@sveltejs/kit';

export const PUT = async ({ request, params, locals: { bucket } }) => {
	const { publicId, key, uploadId, partNumber } = params;

	const multipartUpload = bucket.resumeMultipartUpload(`${publicId}/${key}`, uploadId);

	// TODO Only needed because of a minifalre bug https://github.com/cloudflare/workers-sdk/issues/4373
	const body = request.headers.get('host')?.includes('localhost')
		? await request.blob()
		: request.body;
	if (!body) error(404, { message: 'No Body' });

	const uploadPart = await multipartUpload.uploadPart(Number(partNumber), body);

	return Response.json(uploadPart);
};
