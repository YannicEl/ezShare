import { error, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params, platform }) => {
	const file = await platform?.env.BUCKET.get(`${params.uploadId}/${params.filename}`);

	if (!file) error(404, { message: 'File not found' });

	return new Response(file.body);
};
