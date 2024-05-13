import { maybeArrayToArray } from '$lib/helpers';
import { getRandomId } from '$lib/random';
import { getDb } from '$lib/server/db';
import { defineFormAction } from '$lib/server/handlers/formAction';
import { z } from 'zod';
import { uploads } from '../../drizzle/schema';

const schema = z.object({
	file: z.array(z.instanceof(File)).or(z.instanceof(File)),
});

export const actions = defineFormAction({ schema }, async ({ platform, data }) => {
	const publicId = getRandomId();

	const files = maybeArrayToArray(data.file);

	await Promise.all(
		files.map(async (file) => {
			return platform?.env.BUCKET.put(`${publicId}/${getRandomId()}`, file);
		})
	);

	const db = getDb(platform?.env.DB!);
	await db.insert(uploads).values({
		publicId: getRandomId(),
		createdAt: new Date(),
	});

	return { publicId };
});
