import { relations, sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

const timestamps = {
	createdAt: integer('created_at', { mode: 'timestamp_ms' })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
		.default(sql`CURRENT_TIMESTAMP`)
		.$onUpdate(() => new Date())
		.notNull(),
	deletedAt: integer('deleted_at', { mode: 'timestamp_ms' }),
};

export const uploads = sqliteTable('uploads', {
	id: integer('id').notNull().primaryKey({ autoIncrement: true }),
	publicId: text('public_id').unique().notNull(),
	status: text('status').notNull().$type<'open' | 'closed'>().default('open'),
	...timestamps,
});

export const uploadsRelations = relations(uploads, ({ many }) => ({
	files: many(files),
}));

export const files = sqliteTable('files', {
	id: integer('id').primaryKey({ autoIncrement: true }).notNull(),
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
