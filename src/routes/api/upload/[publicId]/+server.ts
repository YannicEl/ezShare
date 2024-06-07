import { getRandomId } from '$lib/random';
import { getUploadByPublicId } from '$lib/server/db';
import { validateJsonData } from '$lib/server/validation';
import { error } from '@sveltejs/kit';
import { z } from 'zod';

const schema = z.object({
	filename: z.string(),
});

export const POST = async ({ request, params, locals: { db, bucket } }) => {
	const { filename } = await validateJsonData(schema, request);
	const { publicId } = params;

	const upload = await getUploadByPublicId(db, publicId);
	if (!upload || upload.completed) error(403);

	const fileId = getRandomId();
	const { key, uploadId } = await bucket.createMultipartUpload(`${publicId}/${fileId}`, {
		customMetadata: {
			filename,
			fileId,
			publicId,
		},
	});

	return Response.json({ fileId, key, uploadId });
};
