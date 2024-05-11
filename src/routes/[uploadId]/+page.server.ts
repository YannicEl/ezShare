import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ params, platform }) => {
	const query = await platform?.env.BUCKET.list({
		prefix: params.uploadId,
	});

	const files = query?.objects.map((file) => {
		const [_, filename] = file.key.split('/');
		return { key: file.key, name: filename };
	});

	return { files };
};
