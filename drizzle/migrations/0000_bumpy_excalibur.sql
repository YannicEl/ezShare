CREATE TABLE `purchase` (
	`id` integer PRIMARY KEY NOT NULL,
	`public_id` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `purchase_public_id_unique` ON `purchase` (`public_id`);