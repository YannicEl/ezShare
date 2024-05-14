import { defineRequestHandler } from '$lib/server/handlers/requestHandler';
import { error } from '@sveltejs/kit';

export const GET = defineRequestHandler({}, async ({ params, platform }) => {
	const file = await platform?.env.BUCKET.get(params.filename);

	if (!file) error(404, { message: 'File not found' });

	return new Response(file.body);
});
