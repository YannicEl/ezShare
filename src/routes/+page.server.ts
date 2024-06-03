import { maybeArrayToArray } from '$lib/helpers';
import { getRandomId } from '$lib/random';
import type { SelectUpload } from '$lib/server/db';
import { getUploadByPublicId, insertFile, insertUpload, updateUploadById } from '$lib/server/db';
import { validateFormData } from '$lib/server/validation';
import { error, fail, redirect } from '@sveltejs/kit';
import dayjs from 'dayjs';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { files as dbFiles } from '../../drizzle/schema';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, locals: { db } }) => {
	const uploadId = cookies.get('uploadId');
	if (!uploadId) return;

	const upload = await getUploadByPublicId(db, uploadId);
	if (!upload) return;

	// if (upload.completed) throw redirect(303, '/completed');

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
		publicId: upload.publicId,
		files,
	};
};

const uploadSchema = z.object({
	file: z.array(z.instanceof(File)).or(z.instanceof(File)).optional(),
});

const removeSchema = z.object({
	fileId: z.string(),
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

		if (upload.completed) return fail(400, { error: 'upload_completed' });

		const files = maybeArrayToArray(data.file ?? []);

		await Promise.all(
			files
				.filter((file) => file.size > 0)
				.map(async (file) => {
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

		return { action: 'upload', publicId: upload.publicId } as const;
	},

	remove: async ({ request, cookies, locals: { db, bucket } }) => {
		const data = await validateFormData(removeSchema, request);

		const uploadId = cookies.get('uploadId');
		if (!uploadId) error(404, 'Upload not found');

		const upload = await getUploadByPublicId(db, uploadId);
		if (!upload) error(404, 'Upload not found');

		if (upload.completed) return fail(400, { error: 'upload_completed' });

		const file = upload.files.find((file) => file.publicId === data.fileId);
		if (!file) return fail(400, { error: 'file_not_found' });

		await db.delete(dbFiles).where(eq(dbFiles.id, file.id));

		await bucket.delete(`${upload.publicId}/${file.publicId}`);

		return { action: 'remove', fileId: file.publicId } as const;
	},

	complete: async ({ request, cookies, locals: { db, bucket } }) => {
		const uploadId = cookies.get('uploadId');
		if (!uploadId) {
			cookies.delete('uploadId', { path: '/' });
			error(404, 'Upload not found');
		}

		const upload = await getUploadByPublicId(db, uploadId);
		if (!upload) {
			cookies.delete('uploadId', { path: '/' });
			error(404, 'Upload not found');
		}

		if (!upload.files) fail(400, { error: 'no_files_uploaded' });

		await updateUploadById(db, {
			id: upload.id,
			completed: true,
			expiresAt: dayjs().add(7, 'day').toDate(),
		});

		redirect(303, '/completed');
	},
};
