import { getDb, getRandomId } from '$lib';
import type { Actions } from '@sveltejs/kit';
import { uploads } from '../../drizzle/schema';

export const actions: Actions = {
	default: async ({ request, platform }) => {
		const data = await request.formData();
		const file = data.get('file') as File;

		const publicId = getRandomId();

		await platform?.env.BUCKET.put(`${publicId}/${file.name}`, file);

		const db = getDb(platform?.env.DB!);
		await db.insert(uploads).values({
			publicId: getRandomId(),
			createdAt: new Date(),
		});

		return { publicId };
	},
};
