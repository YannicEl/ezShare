ALTER TABLE `files` ADD `created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE `files` ADD `updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE `files` ADD `deleted_at` integer;--> statement-breakpoint
ALTER TABLE `uploads` ADD `updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE `uploads` ADD `deleted_at` integer;