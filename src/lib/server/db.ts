import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../../../drizzle/schema';

export function getDb(D1: D1Database) {
	const db = drizzle(D1, { schema });

	return db;
}
