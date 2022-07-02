import { defineConfig, presetIcons, presetUno, presetWebFonts } from 'unocss';
import { presetScrollbar } from 'unocss-preset-scrollbar';

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
		presetScrollbar(),
	],
});
