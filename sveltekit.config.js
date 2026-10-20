import { createKitConfig } from '@reddoorla/maintenance/configs/svelte';
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

// Netlify sets URL to the production origin at build time. Kit 2 took it as
// `prerender.origin`; kit 3 removed that option, and its replacement,
// `paths.origin`, is also the only origin kit 3's CSRF check accepts a form
// POST from (kit 2 compared with the request's own host). Set, the contact
// form would answer 403 on a Netlify domain alias, and on a custom domain
// attached after the last build (measured on reddoor-starter#187's built
// server). So it is not set: kit keeps its "http://sveltekit-prerender"
// placeholder and the per-host CSRF check, and vite.config.js hands this
// origin to $lib/seo's siteOrigin, which puts it in place of the placeholder
// in the canonical link. Local builds set no URL and keep the placeholder,
// which only shows up in build/ output, never in dev. As in reddoor-starter.
/** @param {string | undefined} value */
const originOf = (value) => {
	if (!value) return undefined;
	try {
		const url = new URL(value);
		return url.protocol === 'https:' || url.protocol === 'http:' ? url.origin : undefined;
	} catch {
		return undefined;
	}
};
export const productionOrigin = originOf(process.env.URL) ?? null;

// SvelteKit 3 refuses `svelte.config.js` (`config_file_unsupported`): its
// configuration is passed to the `sveltekit(...)` plugin in vite.config.js,
// top-level, with no `kit` namespace. It lives here rather than inline so
// eslint.config.js reads the same object. createKitConfig adds `$lib` to
// `alias`, which kit 3 no longer provides. Never set `paths.origin` (above).
export default createKitConfig({ adapter: adapter({ edge: false, split: false }) });
