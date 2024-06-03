import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

const stage = process.argv.includes('--prod') ? 'prod' : 'dev';
const { parsed } = config({
	path: ['.env', `.env.${stage}`],
});

export default defineConfig({
	dialect: 'sqlite',
	driver: 'd1-http',
	schema: './drizzle/schema.ts',
	out: './drizzle/migrations',
	verbose: true,
	strict: true,
	dbCredentials: {
		accountId: parsed?.CLOUDFLARE_ACCOUNT_ID!,
		databaseId: parsed?.D1_ID!,
		token: parsed?.D1_TOKEN!,
	},
});
