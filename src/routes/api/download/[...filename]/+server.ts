import { error } from '@sveltejs/kit';

export const GET = async ({ params, locals: { bucket } }) => {
	const file = await bucket.get(params.filename);
	if (!file) error(404, { message: 'File not found' });

	return new Response(file.body, {
		headers: {
			'Content-Disposition': `attachment; filename="${file.customMetadata?.filename}"`,
		},
	});
};
