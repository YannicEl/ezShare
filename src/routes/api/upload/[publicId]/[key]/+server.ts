import { getUploadByPublicId } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params, locals: { db, bucket } }) => {
	const { publicId, key } = params;

	const upload = await getUploadByPublicId(db, publicId);
	if (!upload || upload.status === 'closed') error(403);

	const { uploadId } = await bucket.createMultipartUpload(`${publicId}/${key}`);

	return Response.json({ key, uploadId });
};
