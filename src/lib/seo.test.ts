import { describe, expect, it } from 'vitest';
import { PRERENDER_PLACEHOLDER_ORIGIN, siteOrigin } from './seo';

describe('siteOrigin', () => {
	it("swaps kit's prerender placeholder for the build's production origin", () => {
		expect(
			siteOrigin(new URL(`${PRERENDER_PLACEHOLDER_ORIGIN}/about`), 'https://www.erpfunds.com')
		).toBe('https://www.erpfunds.com');
	});

	it('keeps the placeholder when the build had no production origin (a local build)', () => {
		expect(siteOrigin(`${PRERENDER_PLACEHOLDER_ORIGIN}/`, null)).toBe(PRERENDER_PLACEHOLDER_ORIGIN);
	});

	it('answers a live request with the host that asked, never the build origin', () => {
		expect(
			siteOrigin(
				new URL('https://deploy-preview-9--erp-industrial.netlify.app/office'),
				'https://www.erpfunds.com'
			)
		).toBe('https://deploy-preview-9--erp-industrial.netlify.app');
	});
});
