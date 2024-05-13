import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ params, platform }) => {
	const t1 = Date.now();
	const query = await platform?.env.BUCKET.list({
		prefix: params.uploadId,
	});
	const t2 = Date.now();

	const files = query?.objects.map((file) => {
		const [_, filename] = file.key.split('/');
		return { key: file.key, name: filename };
	});

	return {
		time: t2 - t1,
		files,
	};
};
