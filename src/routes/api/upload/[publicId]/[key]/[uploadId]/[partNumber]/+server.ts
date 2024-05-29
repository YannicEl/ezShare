import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const PUT: RequestHandler = async ({ request, params, locals: { bucket } }) => {
	const { publicId, key, uploadId, partNumber } = params;

	const multipartUpload = bucket.resumeMultipartUpload(`${publicId}/${key}`, uploadId);

	// TODO Only needed because of a minifalre bug https://github.com/cloudflare/workers-sdk/issues/4373
	const body = await request.blob();
	if (!request.body) error(404, { message: 'No Body' });

	const uploadPart = await multipartUpload.uploadPart(Number(partNumber), body);

	return Response.json(uploadPart);
};
