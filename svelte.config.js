import { createSvelteConfig } from '@reddoorla/maintenance/configs/svelte';
import adapter from '@sveltejs/adapter-netlify';

// VITE_REDDOOR_GATE_FIXTURES=1 builds the /dev fixtures into the bundle, for
// the a11y gate's own build and nothing else (src/routes/dev/+layout.server.ts,
// reddoor-maintenance#948). Set on Netlify it would deploy them, so refuse it
// there, at module load.
if (process.env.VITE_REDDOOR_GATE_FIXTURES && process.env.NETLIFY) {
	throw new Error(
		'VITE_REDDOOR_GATE_FIXTURES is set on Netlify: it builds the /dev fixtures into the ' +
			"deployed site. It belongs to the a11y gate's own build (reddoor-maint audit) only. " +
			'Unset it in the Netlify environment.'
	);
}

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
