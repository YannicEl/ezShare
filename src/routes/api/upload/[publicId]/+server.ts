import { getRandomId } from '$lib/random';
import { getUploadByPublicId } from '$lib/server/db';
import { validateJsonData } from '$lib/server/validation';
import { error } from '@sveltejs/kit';
import { z } from 'zod';
import type { RequestHandler } from './$types';

const schema = z.object({
	filename: z.string(),
});

export const POST: RequestHandler = async ({ request, params, locals: { db, bucket } }) => {
	const { filename } = await validateJsonData(schema, request);
	const { publicId } = params;

	const upload = await getUploadByPublicId(db, publicId);
	if (!upload || upload.status === 'closed') error(403);

	const fileId = getRandomId();
	const { key, uploadId } = await bucket.createMultipartUpload(`${publicId}/${fileId}`, {
		customMetadata: {
			filename,
			fileId,
			publicId,
		},
	});

	return Response.json({ key, uploadId });
};
