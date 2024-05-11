import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params, platform }) => {
	let file = await platform?.env.BUCKET.get(`${params.uploadId}/${params.filename}`);

	const blog = await file?.blob();

	return new Response(blog);
};
