import { defineRequestHandler } from '$lib/server/handlers/requestHandler';
import { error } from '@sveltejs/kit';

export const GET = defineRequestHandler({}, async ({ params, locals: { bucket } }) => {
	const file = await bucket.get(`${params.uploadId}/${params.filename}`);

	if (!file) error(404, { message: 'File not found' });

	return new Response(file.body);
});
