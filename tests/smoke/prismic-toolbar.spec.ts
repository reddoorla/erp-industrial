import { test, expect, type Page } from '@playwright/test';

// Chromium only (the shared config runs chromium): whether window has a listener
// for this event, read through the DevTools protocol.
async function windowListens(page: Page, type: string) {
	const cdp = await page.context().newCDPSession(page);
	try {
		const { result } = await cdp.send('Runtime.evaluate', { expression: 'window' });
		const { listeners } = await cdp.send('DOMDebugger.getEventListeners', {
			objectId: result.objectId!
		});
		return listeners.some((l) => l.type === type);
	} finally {
		await cdp.detach();
	}
}

function watchToolbar(page: Page) {
	const requests: string[] = [];
	page.on('request', (r) => {
		if (/static\.cdn\.prismic\.io\/prismic\.js|prismic-toolbar/.test(r.url()))
			requests.push(r.url());
	});
	return requests;
}

test('a normal visit loads no Prismic toolbar', async ({ page, context }) => {
	const requests = watchToolbar(page);
	// Hydrated means the layout's client code, which mounts PrismicPreview for a
	// preview session, has run. Network idle is not that: the home page streams a
	// Prismic CDN video, which sets when the page goes idle.
	await page.goto('/', { waitUntil: 'domcontentloaded' });
	await page.locator('html[data-hydrated]').waitFor({ state: 'attached' });
	expect(requests).toEqual([]);
	await expect(page.locator('script[src*="static.cdn.prismic.io"]')).toHaveCount(0);
	expect((await context.cookies()).filter((c) => c.name.startsWith('io.prismic'))).toEqual([]);
});

test('a preview session still loads the Prismic toolbar', async ({ page, context, baseURL }) => {
	await context.addCookies([{ name: 'io.prismic.preview', value: '{}', url: baseURL! }]);
	const requests = watchToolbar(page);
	await page.goto('/preview', { waitUntil: 'domcontentloaded' });
	await expect.poll(() => requests.length, { timeout: 15_000 }).toBeGreaterThan(0);
});

// Expected to fail while reddoorla/erp-industrial#87 stands: the layout's fade
// cancels the navigation PrismicPreview starts, so the editor stays on
// /preview/about. When #87 is fixed this reports an unexpected pass; then drop
// the test.fail() call and the reset: false source lines in
// tests/kit-config.spec.ts. test.fail() is declared only after hydration and the
// listener are proved, so a failure before it is red. Its limit: after it, any
// failure counts as "#87 stands" (an end handler that throws, a 500 on /about),
// so a missing unexpected pass proves less than it seems.
test('ending a preview reaches the published page (#87)', async ({ page, context, baseURL }) => {
	// Room for a cold dev server's first compile of /preview/about plus the URL
	// wait; a timeout would be red, not the expected failure.
	test.setTimeout(60_000);
	await context.addCookies([{ name: 'io.prismic.preview', value: '{}', url: baseURL! }]);
	await page.goto('/preview/about', { waitUntil: 'domcontentloaded' });
	await page.locator('html[data-hydrated]').waitFor({ state: 'attached' });
	expect(await windowListens(page, 'prismicPreviewEnd'), 'PrismicPreview listens').toBe(true);
	test.fail(true, 'reddoorla/erp-industrial#87');
	// Dispatch once: each dispatch starts a new goto that supersedes the one in
	// flight, so retrying could keep a slow load from landing even with #87 fixed.
	await page.evaluate(() =>
		window.dispatchEvent(new Event('prismicPreviewEnd', { cancelable: true }))
	);
	await expect(page).toHaveURL((url) => url.pathname === '/about', { timeout: 15_000 });
});
