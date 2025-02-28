import { mdsvex } from 'mdsvex';
// import adapter from '@sveltejs/adapter-node';
import adapter from "svelte-adapter-bun";
import path from 'path';

import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [vitePreprocess(), mdsvex()],

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter(),
		alias: {
			'$shadcn/*': './src/lib/internal/shadcn/*',
			'$components': 'src/components',
			'$layouts': 'data/layouts',
			'$pages': 'data/pages',
			'$svelted': 'src/lib/svelted',
		},
	},

	extensions: ['.svelte', '.svx']
};

export default config;
