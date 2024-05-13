import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params, platform }) => {
	const file = await platform?.env.BUCKET.get(params.filename);

	if (!file) return new Response('File not found', { status: 404 });

	return new Response(file.body);
};
