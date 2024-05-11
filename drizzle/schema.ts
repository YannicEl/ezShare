import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const uploads = sqliteTable('purchase', {
	id: integer('id').primaryKey(),
	publicId: text('public_id').unique().notNull(),

	createdAt: integer('created_at', { mode: 'timestamp_ms' }).default(sql`CURRENT_TIMESTAMP`),
});
