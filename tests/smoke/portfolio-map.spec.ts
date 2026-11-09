import { test, expect, type Page } from '@playwright/test';

// The homepage ends with the "Our Portfolio" slide, whose Buildout map is the last thing a visitor
// scrolls to. On 2026-11-09 the client reported it missing at the bottom of the page: on md+ the
// footer band scrolled the top of a full-height slide away, taking the heading with it, and the
// nav's logo and links sat over the listings and the map (#101). The same day the operator found
// the fix's map too small and edge to edge: at 1280×720 sharing the screen with the footer left the
// widget 360px tall, cut off. So the slide is now --map-slide-h, the screen less the footer band
// but never under 44rem, and the widget sits in the content column as in the Figma design.
//
// These checks hold both halves: where the screen is tall enough, the section and the footer fill
// the last screen; everywhere, resting on the slide shows the whole section, the widget clear of
// the logo, inside the content column and at least 480px tall. They check layout only and do not
// wait for Buildout's iframe, which is third-party.

test.describe.configure({ timeout: 90_000 });

async function settle(page: Page, where: 'bottom' | 'slide') {
	await page.goto('/');
	await page.locator('html[data-hydrated]').waitFor({ state: 'attached' });
	// The layout's afterNavigate scrolls <main> back to the top 400ms after load; a scroll made
	// before then is undone. Wait it out, then scroll and let the logo's 700ms shrink settle.
	await page.waitForTimeout(1000);
	await page.evaluate((where) => {
		const main = document.querySelector('main')!;
		main.style.scrollBehavior = 'auto';
		const section = document.querySelector('section[data-slice-variation="embed"]')!;
		main.scrollTop =
			where === 'bottom' ? main.scrollHeight : main.scrollTop + section.getBoundingClientRect().top;
	}, where);
	await page.waitForTimeout(1000);
}

function measure(page: Page) {
	return page.evaluate(() => {
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
			logo: box(logo)!,
			footerOverflow: deepest - footer.getBoundingClientRect().bottom
		};
	});
}

for (const viewport of [
	{ width: 1440, height: 900 },
	{ width: 1280, height: 720 },
	{ width: 1024, height: 768 }
]) {
	const tall = viewport.height >= 888; // 44rem slide + the 11.5rem footer band
	test(`resting on the portfolio slide shows the whole section at ${viewport.width}×${viewport.height}`, async ({
		page
	}) => {
		await page.setViewportSize(viewport);
		await settle(page, 'slide');
		const m = await measure(page);

		expect(m.section, 'the homepage has an embed slide').not.toBeNull();
		expect(Math.abs(m.section!.top)).toBeLessThanOrEqual(1);
		expect(m.section!.bottom).toBeLessThanOrEqual(viewport.height + 1);
		expect(m.heading!.top).toBeGreaterThanOrEqual(0);
		// The logo's bottom 10px are clipped, so the visible logo ends 10px above its box.
		expect(m.target!.top).toBeGreaterThanOrEqual(m.logo.bottom - 10);
		// Inside the content column: lined up with the logo, and with air below it.
		expect(Math.abs(m.target!.left - m.logo.left)).toBeLessThanOrEqual(1);
		expect(m.target!.bottom).toBeLessThanOrEqual(m.section!.bottom - 40);
		expect(m.target!.height).toBeGreaterThanOrEqual(480);
	});

	if (tall)
		test(`the portfolio section and the footer fill the last screen at ${viewport.width}×${viewport.height}`, async ({
			page
		}) => {
			await page.setViewportSize(viewport);
			await settle(page, 'bottom');
			const m = await measure(page);

			expect(Math.abs(m.section!.top)).toBeLessThanOrEqual(1);
			expect(Math.abs(m.section!.bottom - m.footer.top)).toBeLessThanOrEqual(1);
			expect(Math.abs(m.footer.bottom - viewport.height)).toBeLessThanOrEqual(1);
			expect(m.footerOverflow).toBeLessThanOrEqual(1);
		});
}
