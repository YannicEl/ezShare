import { getUploadByPublicId } from '$lib/server/db';
import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, locals: { db } }) => {
	const uploadId = cookies.get('uploadId');
	if (!uploadId) redirect(303, '/');

	const upload = await getUploadByPublicId(db, uploadId);
	if (!upload) redirect(303, '/');

	if (!upload.completed) redirect(303, '/');
	if (!upload.files) redirect(303, '/');

	return {
		publicId: upload.publicId,
	};
};

export const actions: Actions = {
	default: async ({ cookies }) => {
		cookies.delete('uploadId', { path: '/' });
		redirect(303, '/');
	},
};
