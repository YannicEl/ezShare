import { getDb } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from '../$types';
import { uploads } from '../../../drizzle/schema';

export const load: PageServerLoad = async ({ params, locals }) => {
	const t1 = Date.now();
	const query = await locals.bucket.list({
		prefix: params.uploadId,
	});
	const t2 = Date.now();

	const t3 = Date.now();
	const db = getDb(locals.db);
	const upload = await db.query.uploads.findFirst({
		where: eq(uploads.publicId, params.uploadId),
		with: { files: true },
	});
	const t4 = Date.now();

	console.log('upload');
	console.log(upload);

	const files = upload?.files.map((file) => {
		const [_, filename] = file.key.split('/');
		return { key: file.key, name: filename };
	});

	return {
		timeR2: t2 - t1,
		timeD1: t4 - t3,
		upload,
		files,
	};
};
