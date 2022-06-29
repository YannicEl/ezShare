/// <reference types="vite/client" />

declare module '*.vue' {
	import type { DefineComponent } from 'vue';
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
	const component: DefineComponent<{}, {}, any>;
	export default component;
}

interface ImportMetaEnv {
	readonly VITE_FIREBASE_API_KEY: string;
	readonly VITE_FIREBASE_PROJECT_ID: string;
	readonly VITE_FIREBASE_STORAGE_BUCKET: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
