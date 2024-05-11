import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	dialect: 'sqlite',
	driver: 'd1',
	schema: './drizzle/schema.ts',
	out: './drizzle/migrations',
	verbose: true,
	strict: true,
	dbCredentials: {
		dbName: 'DB',
		wranglerConfigPath: 'wrangler.toml',
	},
});
