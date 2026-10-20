import { test, expect, type Page } from '@playwright/test';
import { capturedWith } from './ingest-capture';

// The fleet's nightly form-e2e probe enters at /contact, waits for
// html[data-hydrated], injects a hidden `testMode=true` input into the first
// <form>, fills it, submits, and waits for [role="status"]. Central ingest drops
// a payload carrying top-level boolean `testMode: true` instead of emailing the
// client, so the marker must survive the form action to the ingest body. That
// body lands on the local capture server (playwright.config.ts), so nothing
// leaves the machine.

// The first navigation can meet a cold dev server that compiles for well over
// the default 30 s before it hydrates.
test.describe.configure({ timeout: 90_000 });

async function fillAndSubmit(page: Page, marker: string, { probe }: { probe: boolean }) {
	await page.goto('/contact');
	await page.locator('html[data-hydrated]').waitFor({ state: 'attached' });
	const form = page.locator('form').first();
	if (probe) {
		await form.evaluate((f) => {
			const el = document.createElement('input');
			el.type = 'hidden';
			el.name = 'testMode';
			el.value = 'true';
			f.appendChild(el);
		});
	}
	await form.locator('[name="email"]').fill('monitor+e2e@reddoorla.com');
	await form.locator('[name="interest"]').selectOption('Leasing');
	await form.locator('[name="message"]').fill(marker);
	// The action silently drops a fill faster than its 800 ms bot-timing floor.
	await page.waitForTimeout(1200);
	await page.locator('button[type="submit"], input[type="submit"]').first().click();
}

test('a probe submission reaches ingest marked testMode, and shows role=status', async ({
	page
}, info) => {
	const marker = `smoke probe ${info.testId}`;
	await fillAndSubmit(page, marker, { probe: true });
	await expect(page.locator('[role="status"]').first()).toBeVisible();
	const bodies = await capturedWith(marker);
	expect(bodies).toHaveLength(1);
	expect(bodies[0].testMode).toBe(true);
});

test('a visitor submission reaches ingest without testMode', async ({ page }, info) => {
	const marker = `smoke visitor ${info.testId}`;
	await fillAndSubmit(page, marker, { probe: false });
	await expect(page.locator('[role="status"]').first()).toBeVisible();
	const bodies = await capturedWith(marker);
	expect(bodies).toHaveLength(1);
	expect(bodies[0]).not.toHaveProperty('testMode');
});
