import { test, expect } from '@playwright/test';

// Every place a scroll can come to rest must be a slide boundary. With `snap-proximity` (2026-06-03
// to 2026-11) the page could stop anywhere, half on one slide and half on the next: on /about at
// 1440×900 an instant scroll settled at 360, 540, 1260… The check maps the effective snap points
// the way the browser does after any scroll: jump to a position, let it re-snap, read where it
// landed. Each landing point must be a multiple of the viewport height (every slide is exactly one
// screen tall) or the end of the page, which is the footer's snap point.

test.describe.configure({ timeout: 90_000 });

for (const path of ['/about', '/office']) {
	test(`a scroll on ${path} always comes to rest on a slide boundary`, async ({ page }) => {
		await page.setViewportSize({ width: 1440, height: 900 });
		await page.goto(path);
		await page.locator('html[data-hydrated]').waitFor({ state: 'attached' });
		// The layout's afterNavigate scrolls <main> to the top 400ms after load.
		await page.waitForTimeout(1000);

		const { landings, viewport, max } = await page.evaluate(async () => {
			const main = document.querySelector('main')!;
			main.style.scrollBehavior = 'auto';
			const max = main.scrollHeight - main.clientHeight;
			const landings = new Set<number>();
			for (let y = 0; y <= max; y += Math.round(main.clientHeight / 5)) {
				main.scrollTop = y;
				await new Promise((r) => setTimeout(r, 250));
				landings.add(Math.round(main.scrollTop));
			}
			return { landings: [...landings], viewport: main.clientHeight, max };
		});

		const offBoundary = landings.filter((y) => y % viewport > 1 && Math.abs(y - max) > 1);
		expect(offBoundary, `resting points ${landings.join(', ')}`).toEqual([]);
		expect(landings.length).toBeGreaterThan(2);
	});
}
