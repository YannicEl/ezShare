import { maybeArrayToArray } from '$lib/helpers';
import { getRandomId } from '$lib/random';
import {
	getFilesByUploadId,
	getUploadByPublicId,
	insertFile,
	insertUpload,
	type SelectUpload,
} from '$lib/server/db';
import { validateFormData } from '$lib/server/validation';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { files as dbFiles } from '../../drizzle/schema';
import type { Actions } from './$types';

const uploadSchema = z.object({
	uploadId: z.string().optional(),
	file: z.array(z.instanceof(File)).or(z.instanceof(File)).optional(),
});

const removeSchema = z.object({
	upload: z.string(),
	file: z.string(),
});

export const actions: Actions = {
	upload: async ({ request, locals: { db, bucket } }) => {
		const data = await validateFormData(uploadSchema, request);

		let upload: SelectUpload | undefined;
		if (data.uploadId) {
			upload = await getUploadByPublicId(db, data.uploadId);
			if (!upload) error(404, 'Upload not found');
		} else {
			const publicId = getRandomId();
			upload = await insertUpload(db, { publicId });
		}

		const files = maybeArrayToArray(data.file ?? []);
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

		const uploadedFiles = (await getFilesByUploadId(db, upload.id)).map((file) => {
			return {
				uploadId: upload.publicId,
				id: file.publicId,
				name: file.name,
				size: file.size,
				uploaded: true,
			};
		});

		return { publicId: upload.publicId, files: uploadedFiles };
	},

	remove: async ({ request, locals: { db, bucket } }) => {
		const data = await validateFormData(removeSchema, request);

		const upload = await getUploadByPublicId(db, data.upload);
		if (!upload) error(404, 'Upload not found');

		const file = upload.files.find((file) => file.publicId === data.file);
		if (!file) error(404, 'File not found');

		await db.delete(dbFiles).where(eq(dbFiles.id, file.id));

		await bucket.delete(`${upload.publicId}/${file.name}`);

		const uploadedFiles = (await getFilesByUploadId(db, upload.id)).map((file) => {
			return {
				uploadId: upload.publicId,
				id: file.publicId,
				name: file.name,
				size: file.size,
				uploaded: true,
			};
		});

		return {
			publicId: upload.publicId,
			files: uploadedFiles,
		};
	},
};
