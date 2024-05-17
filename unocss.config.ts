import { defineConfig, presetIcons, presetUno } from 'unocss';

export default defineConfig({
	presets: [
		presetUno(),
		presetIcons({
			scale: 1.2,
			warn: true,
			cdn: 'https://esm.sh/',
		}),
	],
	theme: {
		fontFamily: {
			sans: ['Inter', 'sans-serif'],
		},
	},
});
