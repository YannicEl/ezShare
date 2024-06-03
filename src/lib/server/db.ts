import { eq, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import { drizzle } from 'drizzle-orm/d1';
import type { SQLiteTable } from 'drizzle-orm/sqlite-core';
import * as schema from '../../../drizzle/schema';
import { files, uploads } from '../../../drizzle/schema';

export type DB = DrizzleD1Database<typeof schema>;
export function getDb(D1: D1Database): DB {
	console.time('drizzel');
	const db = drizzle(D1, { schema });
	console.timeEnd('drizzel');

	return db;
}

async function insert<Table extends SQLiteTable>(
	db: DB,
	table: Table,
	values: InferInsertModel<Table>
): Promise<InferSelectModel<Table>> {
	const [row] = await db.insert(table).values(values).returning();
	return row as InferSelectModel<Table>;
}

export type SelectFile = InferSelectModel<typeof files>;
export type InsertFile = InferInsertModel<typeof files>;
export async function insertFile(db: DB, values: InsertFile): Promise<SelectFile> {
	return insert(db, files, values);
}

export type SelectUpload = InferSelectModel<typeof uploads>;
export type InsertUpload = InferInsertModel<typeof uploads>;
export async function insertUpload(db: DB, values: InsertUpload): Promise<SelectUpload> {
	return insert(db, uploads, values);
}

export async function updateUploadById(db: DB, values: Partial<InsertUpload> & { id: number }) {
	const [row] = await db.update(uploads).set(values).where(eq(uploads.id, values.id)).returning();
	return row;
}

export async function getUploadByPublicId(db: DB, publicId: string) {
	return db.query.uploads.findFirst({
		where: eq(uploads.publicId, publicId),
		with: { files: true },
	});
}

export async function getFilesByUploadId(db: DB, uploadId: number) {
	return db.query.files.findMany({
		where: eq(files.uploadId, uploadId),
	});
}
