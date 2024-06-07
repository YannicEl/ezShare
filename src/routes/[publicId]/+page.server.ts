import { getUploadByPublicId } from '$lib/server/db';
import { error } from '@sveltejs/kit';

export const load = async ({ params: { publicId }, locals: { db } }) => {
	const upload = await getUploadByPublicId(db, publicId);
	if (!upload) error(404, 'Upload not found');

	const files = upload.files.map((file) => {
		return {
			uploadId: upload.publicId,
			id: file.publicId,
			name: file.name,
			size: file.size,
			uploaded: true,
		} as const;
	});

	return {
		publicId,
		files,
	};
};
