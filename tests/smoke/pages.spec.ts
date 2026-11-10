import { test, expect, type Page, type ConsoleMessage } from '@playwright/test';
import { smokeRoutes } from './routes';

// Console messages we don't care about. Add patterns here only after seeing them
// in CI and confirming they aren't actionable. Patterns are matched against both
// the message text and the offending resource URL — Chromium's "Failed to load
// resource" text omits the URL, so URL matching catches third-party network noise.
const ALLOWED_CONSOLE_PATTERNS: RegExp[] = [
	// Vimeo iframe embeds + their CDN telemetry endpoints occasionally 403 from
	// cloud IPs due to bot detection.
	/vimeo/i,
	// Turnstile (Cloudflare) telemetry occasionally surfaces in console.
	/turnstile|challenges\.cloudflare/i
];

function attachConsoleWatcher(page: Page, extraAllowed: RegExp[] = []) {
	const errors: string[] = [];
	const allowed = [...ALLOWED_CONSOLE_PATTERNS, ...extraAllowed];
	const isAllowed = (s: string) => !!s && allowed.some((re) => re.test(s));

	page.on('console', (msg: ConsoleMessage) => {
		if (msg.type() !== 'error') return;
		const text = msg.text();
		const url = msg.location()?.url ?? '';
		if (isAllowed(text) || isAllowed(url)) return;
		errors.push(`[console.error] ${text}${url ? ` (${url})` : ''}`);
	});

	page.on('pageerror', (err) => {
		if (isAllowed(err.message)) return;
		errors.push(`[pageerror] ${err.message}`);
	});

	return errors;
}

for (const route of smokeRoutes) {
	test(`${route.path} (${route.name}) loads with no console errors`, async ({ page }) => {
		const errors = attachConsoleWatcher(page);
		const response = await page.goto(route.path, {
			waitUntil: 'domcontentloaded'
		});
		expect(response?.status(), `HTTP status for ${route.path}`).toBe(route.expectStatus ?? 200);
		if (route.hydrationMarker) {
			await expect(
				page.locator(route.hydrationMarker),
				`hydration marker "${route.hydrationMarker}" on ${route.path}`
			).toBeVisible();
		}
		expect(errors, `console errors on ${route.path}`).toEqual([]);
	});
}

// The designed not-found page (src/routes/+error.svelte), for a missing Prismic page (/[uid]
// throws 404) and for a path no route matches. Both must answer a real 404, never a soft 200,
// carry noindex and no canonical, and show the site's nav, footer and the way back.
for (const path of ['/this-uid-does-not-exist', '/a/b/c']) {
	test(`404 page renders the designed error page at ${path}`, async ({ page }) => {
		// The browser logs a top-level "Failed to load resource: 404" for the page
		// itself — expected on a 404 route, not a bug. Allow it here.
		const errors = attachConsoleWatcher(page, [/Failed to load resource.*404/i]);
		const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
		expect(response?.status()).toBe(404);
		await expect(page.getByRole('heading', { level: 1, name: 'Page not found' })).toBeVisible();
		await expect(page.getByText('404', { exact: true })).toBeVisible();
		await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
		await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
		await expect(page).toHaveTitle('Page not found | ERP Industrials');
		const section = page.locator('section').filter({ hasText: 'Page not found' });
		for (const [name, href] of [
			['Home', '/'],
			['Industrial Portfolio', '/portfolio'],
			['Contact', '/contact']
		])
			await expect(section.getByRole('link', { name, exact: true })).toHaveAttribute('href', href);
		await expect(page.locator('footer')).toBeAttached();
		expect(errors).toEqual([]);
	});
}
