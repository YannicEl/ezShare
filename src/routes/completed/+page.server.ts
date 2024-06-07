import { getUploadByPublicId } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';

export const load = async ({ cookies, locals: { db } }) => {
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

export const actions = {
	default: async ({ cookies }) => {
		cookies.delete('uploadId', { path: '/' });
		redirect(303, '/');
	},
};
