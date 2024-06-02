import { getDb } from '$lib/server/db';
import type { Handle } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	if (!event.platform?.env) error(500, 'Cloudflare bindings not found');

	const { DB, BUCKET } = event.platform?.env!;
	event.locals.db = getDb(DB);
	event.locals.bucket = BUCKET;

	return resolve(event);
};
