import { defineConfig, presetIcons, presetUno, presetWebFonts } from 'unocss';

export default defineConfig({
	presets: [
		presetUno(),
		presetIcons({
			scale: 1.2,
			warn: true,
		}),
		presetWebFonts({
			fonts: {
				sans: 'Montserrat',
			},
		}),
	],
});
