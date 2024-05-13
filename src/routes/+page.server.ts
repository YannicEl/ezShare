import { getRandomId } from '$lib/random';
import { getDb } from '$lib/server/db';
import type { Actions } from '@sveltejs/kit';
import { z } from 'zod';
import { uploads } from '../../drizzle/schema';

const schema = z.object({});

export const actions: Actions = {
	default: async ({ request, platform }) => {
		const data = await request.formData();
		const files = data.getAll('file') as File[];

		const publicId = getRandomId();

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
	},
};
