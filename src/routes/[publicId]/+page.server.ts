import { getUploadByPublicId } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params: { publicId }, locals: { db } }) => {
	const upload = await getUploadByPublicId(db, publicId);
	if (!upload) error(404, 'Upload not found');

	const files = upload.files.map(({ name, size }) => {
		return { name, size };
	});

	return {
		publicId,
		files,
	};
};
