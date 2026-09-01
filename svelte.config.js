import { createSvelteConfig } from '@reddoorla/maintenance/configs/svelte';
import adapter from '@sveltejs/adapter-netlify';

/** @type {import('@sveltejs/kit').Config} */
export default createSvelteConfig({
	kit: {
		adapter: adapter({ edge: false, split: false }),
		// Netlify sets URL to the production origin at build time. Without this,
		// prerendered pages bake SvelteKit's "http://sveltekit-prerender"
		// placeholder into the canonical link. Local builds keep the placeholder
		// (build output only, never dev). Mirrors the reddoor-starter.
		...(process.env.URL ? { prerender: { origin: process.env.URL } } : {})
	}
});
