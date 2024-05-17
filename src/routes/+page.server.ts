import { maybeArrayToArray } from '$lib/helpers';
import { getRandomId } from '$lib/random';
import { insertFile, insertUpload } from '$lib/server/db';
import { validateFormData } from '$lib/server/validation';
import { z } from 'zod';
import type { Actions } from './$types';

const schema = z.object({
	file: z.array(z.instanceof(File)).or(z.instanceof(File)).optional(),
});

export const actions: Actions = {
	default: async ({ request, locals: { db, bucket } }) => {
		const data = await validateFormData(schema, request);

		let publicId = getRandomId();
		let [upload] = await insertUpload(db, { publicId });

		const files = maybeArrayToArray(data.file ?? []);
		await Promise.all(
			files.map(async (file) => {
				await insertFile(db, {
					uploadId: upload.id,
					name: file.name,
					size: file.size,
				});
				await bucket.put(`${publicId}/${file.name}`, file);
			})
		);

		return { publicId };
	},
};
