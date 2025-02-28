import { sveltekit } from '@sveltejs/kit/vite';
import { sveltePhosphorOptimize } from "phosphor-svelte/vite";
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltePhosphorOptimize(), sveltekit()],
});
