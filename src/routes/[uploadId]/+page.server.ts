import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { uploads } from '../../../drizzle/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals: { db } }) => {
	const upload = await db.query.uploads.findFirst({
		where: eq(uploads.publicId, params.uploadId),
		with: { files: true },
	});

	if (!upload) error(404, 'Upload not found');

	const files = upload.files.map(({ name, size }) => {
		return { name, size };
	});

	return {
		publicId: params.uploadId,
		files,
	};
};
