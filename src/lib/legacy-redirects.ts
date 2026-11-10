// Where the old erpfunds.com's .html pages go now.
//
// Google still ranks /fasken-center.html first for "fasken" (8,233 impressions
// and 164 clicks in the 16 months to 2026-11-08), and it 404s here; Search
// Console reported it as "Not found (404)" on 2026-11-09. Each key below is an
// old URL that answered 404, with where it was found beside it.
//
// WHY A HOOK AND NOT netlify.toml. adapter-netlify (split: false) serves the
// site through one function claiming `/*`, and Netlify evaluates a function's
// path before redirect rules, so a [[redirects]] rule for a path that is not a
// static file would never be read. The hook sees exactly those requests.

/** Exact old paths, lowercased, to where they go. */
export const LEGACY_PATHS: Record<string, string> = {
	// The Office page carries the Fasken Center (its "Fasken Center" slide).
	'/fasken-center.html': '/office',
	// Search Console's 2026-11-09 report (2 impressions, August 2025).
	'/who-we-are.html': '/about',
	// Midland Polo's sponsor page links here (ERP's Brennan Berry, 2026-11-10), and visitors got
	// the bare 404. It goes to the homepage, as he asked: the homepage ends on the portfolio map.
	'/industrial-properties.html': '/',
	// The old site's pages were `<name>.html`. Every current page's .html twin is a prerendered
	// static file Netlify serves (200, canonical to the clean URL) except /contact, which is not
	// prerendered, so its twin 404ed.
	'/contact.html': '/contact',
	// The contact form's thank-you button linked here until 2026-11-10; it was never a page.
	'/industrial-portfolio': '/portfolio'
};

/** Where an old URL's path goes, or null for a path the old site never had. */
export function legacyRedirect(pathname: string): string | null {
	return LEGACY_PATHS[pathname.toLowerCase()] ?? null;
}

/**
 * The full Location for an old URL: its successor plus the visitor's own query string, or null.
 * The query is kept so a tagged link (Midland Polo's sponsor link with `?utm_…`) still reaches
 * gtag on the page it lands on (#107). Only the visitor's query reaches it: on a data request kit
 * deletes its own `x-sveltekit-invalidated` and trailing-slash parameters from `event.url` before
 * the hook runs, and it answers any other `x-sveltekit-*` parameter with a 400 before the hook.
 */
export function legacyLocation(url: Pick<URL, 'pathname' | 'search'>): string | null {
	const target = legacyRedirect(url.pathname);
	return target === null ? null : target + url.search;
}
