ALTER TABLE `uploads` ADD `completed` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `uploads` ADD `expires_at` integer;--> statement-breakpoint
ALTER TABLE `files` DROP COLUMN `deleted_at`;--> statement-breakpoint
ALTER TABLE `uploads` DROP COLUMN `status`;--> statement-breakpoint
ALTER TABLE `uploads` DROP COLUMN `deleted_at`;