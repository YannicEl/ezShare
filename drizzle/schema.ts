import { relations, sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const uploads = sqliteTable('uploads', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	publicId: text('public_id').unique().notNull(),

	createdAt: integer('created_at', { mode: 'timestamp_ms' }).default(sql`CURRENT_TIMESTAMP`),
});

export const uploadsRelations = relations(uploads, ({ many }) => ({
	files: many(files),
}));

export const files = sqliteTable('files', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	uploadId: integer('upload_id').references(() => uploads.id),
	name: text('name').notNull(),
	size: integer('size').notNull(),
});

export const filesRelation = relations(files, ({ one }) => ({
	upload: one(uploads, {
		fields: [files.uploadId],
		references: [uploads.id],
	}),
}));
