import { describe, it, expect } from 'vitest';
import { contactFields } from './contact-payload';

function form(entries: Record<string, string>): FormData {
	const fd = new FormData();
	for (const [k, v] of Object.entries(entries)) fd.set(k, v);
	return fd;
}

describe('contactFields', () => {
	it('forwards the form-e2e probe marker as top-level boolean testMode', () => {
		const fields = contactFields(
			form({ email: 'a@b.co', message: 'hi', interest: 'Leasing', testMode: 'true' })
		);
		expect(fields.testMode).toBe(true);
	});

	it('leaves testMode off a real visitor submission', () => {
		const fields = contactFields(form({ email: 'a@b.co', message: 'hi', interest: 'Leasing' }));
		expect(fields).not.toHaveProperty('testMode');
	});

	it('ignores any testMode value but the string "true"', () => {
		for (const v of ['false', '1', 'TRUE', '']) {
			expect(contactFields(form({ email: 'a@b.co', testMode: v }))).not.toHaveProperty('testMode');
		}
	});

	it('maps the visitor fields', () => {
		expect(contactFields(form({ email: 'a@b.co', message: 'hi', interest: 'Leasing' }))).toEqual({
			email: 'a@b.co',
			message: 'hi',
			interest: 'Leasing'
		});
		expect(contactFields(form({ email: 'a@b.co', interest: '' })).interest).toBeUndefined();
	});
});
