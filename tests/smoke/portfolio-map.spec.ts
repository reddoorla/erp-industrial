import { test, expect, type Page } from '@playwright/test';

// The homepage ends with the "Our Portfolio" slide, whose Buildout map is the last thing a visitor
// scrolls to. On 2026-11-09 the client reported it missing at the bottom of the page. On md+ the
// footer is a band of --footer-h, and a full-height slide above it had that much of its top
// scrolled away, taking the heading with it; the nav's logo and links sat over the listings and
// the map. The footer's link column also overflowed its band, which in Chromium lengthened the
// page by another 14–40px. These checks hold the last screen: slide top at the top of the
// screen, heading and map below the logo, footer filling the rest with nothing spilling out of it.
// They check layout only and do not wait for Buildout's iframe, which is third-party.

test.describe.configure({ timeout: 90_000 });

async function scrollToBottom(page: Page) {
	await page.goto('/');
	await page.locator('html[data-hydrated]').waitFor({ state: 'attached' });
	// The layout's afterNavigate scrolls <main> back to the top 400ms after load; a scroll made
	// before then is undone. Wait it out, then scroll and let the logo's 700ms shrink settle.
	await page.waitForTimeout(1000);
	await page.evaluate(() => {
		const main = document.querySelector('main')!;
		main.style.scrollBehavior = 'auto';
		main.scrollTop = main.scrollHeight;
	});
	await page.waitForTimeout(1000);
}

for (const viewport of [
	{ width: 1440, height: 900 },
	{ width: 1024, height: 768 },
	{ width: 1280, height: 720 }
]) {
	test(`the portfolio map fills the last screen above the footer at ${viewport.width}×${viewport.height}`, async ({
		page
	}) => {
		await page.setViewportSize(viewport);
		await scrollToBottom(page);

		const m = await page.evaluate(() => {
			const box = (el: Element | null) => el?.getBoundingClientRect() ?? null;
			const section = document.querySelector('section[data-slice-variation="embed"]');
			const footer = document.querySelector('footer')!;
			const logo = document.querySelector('img[alt="ERP Industrials"]');
			const deepest = Math.max(
				...[...footer.querySelectorAll('*')].map((e) => e.getBoundingClientRect().bottom)
			);
			return {
				section: box(section),
				heading: box(section?.querySelector('h3') ?? null),
				target: box(document.getElementById('buildout')),
				footer: footer.getBoundingClientRect(),
				logoBottom: box(logo)!.bottom,
				footerOverflow: deepest - footer.getBoundingClientRect().bottom
			};
		});

		expect(m.section, 'the homepage has an embed slide').not.toBeNull();
		expect(Math.abs(m.section!.top)).toBeLessThanOrEqual(1);
		expect(Math.abs(m.section!.bottom - m.footer.top)).toBeLessThanOrEqual(1);
		expect(Math.abs(m.footer.bottom - viewport.height)).toBeLessThanOrEqual(1);
		expect(m.footerOverflow).toBeLessThanOrEqual(1);
		expect(m.heading!.top).toBeGreaterThanOrEqual(0);
		// The logo's bottom 10px are clipped, so the visible logo ends 10px above its box.
		expect(m.target!.top).toBeGreaterThanOrEqual(m.logoBottom - 10);
		expect(m.target!.bottom).toBeLessThanOrEqual(m.footer.top);
	});
}
