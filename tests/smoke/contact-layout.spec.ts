import { test, expect } from '@playwright/test';

// The contact page has its own footer (src/lib/components/ContactFooter.svelte, the operator,
// 2026-11-10). Before it, the form sat in a fixed full-screen section that scrolled inside itself
// under the shared footer band, the footer repeated the nav's logo at the same size, and on a phone
// there was no footer at all. These hold the fix: the form does not scroll on its own, the footer
// carries no logo and lists Home, and scrolling the page to its end shows the whole footer.

test.describe.configure({ timeout: 60_000 });

for (const viewport of [
	{ width: 1440, height: 900 },
	{ width: 1024, height: 768 },
	{ width: 390, height: 664 }
]) {
	test(`the contact page and its own footer at ${viewport.width}×${viewport.height}`, async ({
		page
	}) => {
		await page.setViewportSize(viewport);
		await page.goto('/contact');
		await page.locator('html[data-hydrated]').waitFor({ state: 'attached' });

		const section = page.locator('section').filter({ has: page.locator('form#contact') });
		const scrollsInside = await section.evaluate(
			(el) => el.scrollHeight > el.clientHeight + 1 && getComputedStyle(el).overflowY !== 'visible'
		);
		expect(scrollsInside, 'the contact section scrolls on its own').toBe(false);

		const footer = page.locator('footer');
		await expect(footer).toHaveCount(1);
		await expect(footer.locator('img[alt="ERP Industrials"]')).toHaveCount(0);
		await expect(footer.getByRole('link', { name: 'Home', exact: true })).toHaveAttribute(
			'href',
			'/'
		);
		await expect(page.locator('img[alt="ERP Industrials"]')).toHaveCount(1);

		// Let the layout's afterNavigate reset (400ms) pass, then scroll <main> to its end.
		await page.waitForTimeout(1000);
		const box = await page.evaluate(async () => {
			const main = document.querySelector('main')!;
			main.style.scrollBehavior = 'auto';
			main.scrollTop = main.scrollHeight;
			await new Promise((r) => setTimeout(r, 500));
			const f = document.querySelector('footer')!.getBoundingClientRect();
			return { top: f.top, bottom: f.bottom, height: innerHeight };
		});
		expect(box.top).toBeGreaterThanOrEqual(0);
		expect(Math.abs(box.bottom - box.height)).toBeLessThanOrEqual(1);
	});
}
