// import adapter from '@sveltejs/adapter-auto';

// Bun adapter docs: https://github.com/gornostay25/svelte-adapter-bun
import adapter from "svelte-adapter-bun";

import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [vitePreprocess({})],

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter({
			precompress: {
			  brotli: true,
			  gzip: true,
			  files: ["htm", "html"],
			},
		  }),
		files: {
			assets: path.resolve('./public'),
		},
		alias: {
			$components: path.resolve('./src/components'),
			$layouts: path.resolve('./data/layouts'),
			$pages: path.resolve('./data/pages'),
			$svelted: path.resolve('./src/lib/svelted'),
		}
	}
};

export default config;
