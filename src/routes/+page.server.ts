import { maybeArrayToArray } from '$lib/helpers';
import { getRandomId } from '$lib/random';
import { getUploadByPublicId, insertFile, insertUpload, type SelectUpload } from '$lib/server/db';
import { validateFormData } from '$lib/server/validation';
import { error, fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { files as dbFiles } from '../../drizzle/schema';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, locals: { db } }) => {
	const uploadId = cookies.get('uploadId');
	if (!uploadId) return;

	const upload = await getUploadByPublicId(db, uploadId);
	if (!upload) return;

	const files = upload.files.map((file) => {
		return {
			uploadId: upload.publicId,
			id: file.publicId,
			name: file.name,
			size: file.size,
		};
	});

	return {
		publicId: upload.publicId,
		files,
	};
};

const uploadSchema = z.object({
	file: z.array(z.instanceof(File)).or(z.instanceof(File)).optional(),
});

const removeSchema = z.object({
	file: z.string(),
});

export const actions: Actions = {
	upload: async ({ request, cookies, locals: { db, bucket } }) => {
		const data = await validateFormData(uploadSchema, request);

		let upload: SelectUpload | undefined;
		const uploadId = cookies.get('uploadId');
		if (uploadId) {
			upload = await getUploadByPublicId(db, uploadId);
			if (!upload) error(404, 'Upload not found');
		} else {
			const publicId = getRandomId();
			upload = await insertUpload(db, { publicId });
			cookies.set('uploadId', upload.publicId, { path: '/' });
		}

		const files = maybeArrayToArray(data.file ?? []);

		if (!files.length) return fail(422, { error: true });

		await Promise.all(
			files.map(async (file) => {
				const fileId = getRandomId();
				await bucket.put(`${upload.publicId}/${fileId}`, file);
				await insertFile(db, {
					publicId: fileId,
					uploadId: upload.id,
					name: file.name,
					size: file.size,
				});
			})
		);
	},

	remove: async ({ request, locals: { db, bucket } }) => {
		const data = await validateFormData(removeSchema, request);

		const upload = await getUploadByPublicId(db, data.upload);
		if (!upload) error(404, 'Upload not found');

		const file = upload.files.find((file) => file.publicId === data.file);
		if (!file) error(404, 'File not found');

		await db.delete(dbFiles).where(eq(dbFiles.id, file.id));

		await bucket.delete(`${upload.publicId}/${file.name}`);
	},
};
