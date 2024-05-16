import { error, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	if (!event.platform?.env) error(500, 'Cloudflare bindings not found');

	const { DB, BUCKET } = event.platform.env;
	event.locals.db = DB;
	event.locals.bucket = BUCKET;

	return resolve(event);
};
