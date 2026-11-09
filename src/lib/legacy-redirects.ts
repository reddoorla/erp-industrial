// Where the old erpfunds.com's .html pages go now.
//
// Google still ranks /fasken-center.html first for "fasken" (8,233 impressions
// and 164 clicks in the 16 months to 2026-11-08), and it 404s here; Search
// Console reported it as "Not found (404)" on 2026-11-09. Each key below is a
// URL Search Console has served for this site that answers 404 now.
//
// WHY A HOOK AND NOT netlify.toml. adapter-netlify (split: false) serves the
// site through one function claiming `/*`, and Netlify evaluates a function's
// path before redirect rules, so a [[redirects]] rule for a path that is not a
// static file would never be read. The hook sees exactly those requests.

/** Exact old paths, lowercased, to where they go. */
export const LEGACY_PATHS: Record<string, string> = {
	// The Office page carries the Fasken Center (its "Fasken Center" slide).
	'/fasken-center.html': '/office',
	'/who-we-are.html': '/about'
};

/** Where an old URL's path goes, or null for a path the old site never had. */
export function legacyRedirect(pathname: string): string | null {
	return LEGACY_PATHS[pathname.toLowerCase()] ?? null;
}
