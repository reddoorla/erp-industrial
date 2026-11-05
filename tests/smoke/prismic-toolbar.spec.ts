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
	await page.goto('/', { waitUntil: 'load' });
	await page.waitForTimeout(3000);
	expect(requests).toEqual([]);
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
// failure counts as "#87 stands" (a "fix" whose first navigation lands somewhere
// other than /about, such as / from a bad prefix strip), so a missing unexpected
// pass proves less than it seems. An end handler
// that throws is red, not expected: nothing navigates, and the wait below runs to
// the test budget and ends timedOut.
test('ending a preview reaches the published page (#87)', async ({ page, context, baseURL }) => {
	// Room for a cold dev server's first compile of /preview/about plus the
	// navigation wait; a timeout would be red, not the expected failure.
	test.setTimeout(60_000);
	await context.addCookies([{ name: 'io.prismic.preview', value: '{}', url: baseURL! }]);
	await page.goto('/preview/about', { waitUntil: 'domcontentloaded' });
	await page.locator('html[data-hydrated]').waitFor({ state: 'attached' });
	expect(await windowListens(page, 'prismicPreviewEnd'), 'PrismicPreview listens').toBe(true);
	test.fail(true, 'reddoorla/erp-industrial#87');
	// Wait for the first main-frame navigation after the dispatch, then assert where
	// it went. With #87 standing, PrismicPreview pushes back to /preview/about about
	// 0.5 s later. With #87 fixed, the first navigation is /about, however long its
	// load takes, so no fixed wait decides the result.
	const next = page.waitForEvent('framenavigated', {
		predicate: (f) => f === page.mainFrame(),
		timeout: 0
	});
	// Dispatch once: each dispatch starts a new goto that supersedes the one in
	// flight, so retrying could keep a slow load from landing even with #87 fixed.
	await page.evaluate(() =>
		window.dispatchEvent(new Event('prismicPreviewEnd', { cancelable: true }))
	);
	expect(new URL((await next).url()).pathname).toBe('/about');
});
