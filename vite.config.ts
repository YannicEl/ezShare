import Vue from '@vitejs/plugin-vue';
import Unocss from 'unocss/vite';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		Vue({
			reactivityTransform: 'true',
		}),
		Unocss(),
		Components({
			dirs: ['src/components', 'src/pages'],
			dts: 'src/components.d.ts',
		}),
		AutoImport({
			imports: ['vue', 'vue/macros', '@vueuse/core'],
			dts: 'src/auto-imports.d.ts',
			dirs: ['src/composables'],
			vueTemplate: true,
		}),
	],
});
