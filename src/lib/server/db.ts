import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../../../drizzle/schema';
import { files, uploads } from '../../../drizzle/schema';

export type DB = DrizzleD1Database<typeof schema>;
export function getDb(D1: D1Database): DB {
	console.time('drizzel');
	const db = drizzle(D1, { schema });
	console.timeEnd('drizzel');

	return db;
}

type SelectFile = InferSelectModel<typeof files>;
type InsertFile = InferInsertModel<typeof files>;
export async function insertFile(db: DB, file: InsertFile): Promise<SelectFile[]> {
	return db.insert(files).values(file).returning();
}

type SelectUpload = InferSelectModel<typeof uploads>;
type InsertUpload = InferInsertModel<typeof uploads>;
export async function insertUpload(db: DB, upload: InsertUpload): Promise<SelectUpload[]> {
	return db.insert(uploads).values(upload).returning();
}
