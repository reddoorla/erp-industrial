import { describe, expect, it } from 'vitest';

import { LEGACY_PATHS, legacyRedirect } from './legacy-redirects';

describe('legacyRedirect', () => {
	it('sends the old pages Google still serves to their successors', () => {
		expect(legacyRedirect('/fasken-center.html')).toBe('/office');
		expect(legacyRedirect('/who-we-are.html')).toBe('/about');
	});

	it('matches whatever case the link was typed in', () => {
		expect(legacyRedirect('/Fasken-Center.html')).toBe('/office');
	});

	it('leaves every path of this site alone, its targets included, so nothing loops', () => {
		const own = ['/', '/about', '/office', '/portfolio', '/investors', '/contact', '/index.html'];
		for (const path of [...own, ...Object.values(LEGACY_PATHS)])
			expect(legacyRedirect(path), path).toBeNull();
	});
});
