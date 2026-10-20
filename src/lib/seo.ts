/** The origin SvelteKit gives `page.url` while prerendering, when no
 *  `paths.origin` is set (kit 3: core/postbuild/prerender.js). */
export const PRERENDER_PLACEHOLDER_ORIGIN = 'http://sveltekit-prerender';

const BUILD_ORIGIN = typeof __REDDOOR_SITE_ORIGIN__ === 'string' ? __REDDOOR_SITE_ORIGIN__ : null;

/**
 * The origin a page's canonical link carries. Per request it is the host that
 * asked. While prerendering, kit's placeholder is replaced with Netlify's
 * production `URL` from the build; sveltekit.config.js does not set
 * `paths.origin`, because kit 3 would then refuse form posts from every other
 * host. Copied from reddoor-starter's $lib/seo.
 */
export function siteOrigin(
	url: Pick<URL, 'origin'> | string,
	buildOrigin: string | null = BUILD_ORIGIN
): string {
	const origin = typeof url === 'string' ? new URL(url).origin : url.origin;
	return origin === PRERENDER_PLACEHOLDER_ORIGIN && buildOrigin ? buildOrigin : origin;
}
