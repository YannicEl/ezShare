import { maybeArrayToArray } from '$lib/helpers';
import { getRandomId } from '$lib/random';
import { insertFile, insertUpload } from '$lib/server/db';
import { defineFormAction } from '$lib/server/handlers/formAction';
import { z } from 'zod';

const schema = z.object({
	file: z.array(z.instanceof(File)).or(z.instanceof(File)).optional(),
});

export const actions = defineFormAction({ schema }, async ({ data, locals: { db, bucket } }) => {
	const publicId = getRandomId();
	const [upload] = await insertUpload(db, { publicId });

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
});
