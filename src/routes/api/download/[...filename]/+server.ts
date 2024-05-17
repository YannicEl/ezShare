import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, locals: { bucket } }) => {
	const file = await bucket.get(params.filename);

	if (!file) error(404, { message: 'File not found' });

	return new Response(file.body);
};
