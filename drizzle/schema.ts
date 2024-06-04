import { relations, sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { getRandomId } from '../src/lib/random';

const timestamps = {
	createdAt: integer('created_at', { mode: 'timestamp_ms' })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
		.default(sql`CURRENT_TIMESTAMP`)
		.$onUpdate(() => new Date())
		.notNull(),
};

export const uploads = sqliteTable('uploads', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	publicId: text('public_id').unique().default(getRandomId()).notNull(),
	completed: integer('completed', { mode: 'boolean' }).default(false).notNull(),
	expiresAt: integer('expires_at', { mode: 'timestamp_ms' }),
	...timestamps,
});

export const uploadsRelations = relations(uploads, ({ many }) => ({
	files: many(files),
}));

export const files = sqliteTable('files', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	publicId: text('public_id').unique().default(getRandomId()).notNull(),
	uploadId: integer('upload_id')
		.references(() => uploads.id)
		.notNull(),
	name: text('name').notNull(),
	size: integer('size').notNull(),
	...timestamps,
});

export const filesRelation = relations(files, ({ one }) => ({
	upload: one(uploads, {
		fields: [files.uploadId],
		references: [uploads.id],
	}),
}));
