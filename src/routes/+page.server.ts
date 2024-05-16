import { maybeArrayToArray } from '$lib/helpers';
import { getRandomId } from '$lib/random';
import { getDb, insertFile } from '$lib/server/db';
import { defineFormAction } from '$lib/server/handlers/formAction';
import { z } from 'zod';
import { uploads } from '../../drizzle/schema';

const schema = z.object({
	file: z.array(z.instanceof(File)).or(z.instanceof(File)),
});

export const actions = defineFormAction({ schema }, async ({ platform, data, locals }) => {
	const publicId = getRandomId();

	const files = maybeArrayToArray(data.file);

	const db = getDb(locals.db);
	const [upload] = await db
		.insert(uploads)
		.values({
			publicId,
		})
		.returning();

	await Promise.all(
		files.map(async (file) => {
			const temp = await insertFile(db, { uploadId: upload.id });
			console.log(temp);
			await locals.bucket.put(`${publicId}/${getRandomId()}`, file);
		})
	);

	return { publicId };
});
