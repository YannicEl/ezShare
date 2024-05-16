// See https://kit.svelte.dev/docs/types#app

import type { DB } from '$lib/server/db';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			db: DB;
			bucket: R2Bucket;
		}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env: Env;
			cf: CfProperties;
			ctx: ExecutionContext;
		}
	}
}

export {};
