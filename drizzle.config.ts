import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

let stage: 'local' | 'dev' | 'prod' = 'local';
if (process.argv.includes('--prod')) {
	stage = 'prod';
} else if (process.argv.includes('--dev')) {
	stage = 'dev';
}

const { parsed } = config({
	path: ['.env', `.env.${stage}`],
});

export default defineConfig({
	dialect: 'sqlite',
	driver: stage === 'local' ? undefined : 'd1-http',
	schema: './drizzle/schema.ts',
	out: './drizzle/migrations',
	verbose: true,
	strict: true,
	dbCredentials:
		stage === 'local'
			? {
					url: './.wrangler/state/v3/d1/miniflare-D1DatabaseObject/0793164f3fd595b5e9dc144561732b42bb3b8c9d3d6d8a57e69f2753f2849d3d.sqlite',
				}
			: {
					accountId: parsed?.CLOUDFLARE_ACCOUNT_ID!,
					databaseId: parsed?.D1_ID!,
					token: parsed?.D1_TOKEN!,
				},
});
