import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { prismicBarrel } from './scripts/prismic-barrel';
import kitConfig, { productionOrigin } from './sveltekit.config.js';

export default defineConfig({
	// SvelteKit 3 takes its configuration here, not from svelte.config.js
	// (which it refuses to start beside).
	plugins: [sveltekit(kitConfig), prismicBarrel()],
	// The production origin for $lib/seo's siteOrigin (sveltekit.config.js says why).
	define: { __REDDOOR_SITE_ORIGIN__: JSON.stringify(productionOrigin) },
	server: {
		fs: {
			// Allow access to files from the project root.
			allow: ['..']
		}
	},
	test: {
		environment: 'jsdom',
		include: ['src/**/*.test.{js,ts}'],
		setupFiles: ['./vitest-setup.ts'],
		server: {
			deps: {
				inline: ['@testing-library/svelte']
			}
		}
	},
	resolve: process.env.VITEST ? { conditions: ['browser'] } : undefined
});
