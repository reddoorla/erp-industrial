import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/svelte';
import RichText from './index.svelte';
import type { RichTextSlice } from '../../../prismicio-types';

afterEach(() => cleanup());

// A paragraph carrying two labelled spans: one `codespan`, one ordinary label.
// @prismicio/svelte 2 hands a rich-text component its content as a `children`
// snippet (1.x used a default slot), so these assert the labelled TEXT survives,
// not only the wrapping element.
function sliceWith(text: string, spans: { start: number; end: number; label: string }[]) {
	return {
		id: 'rich_text$1',
		slice_type: 'rich_text',
		slice_label: null,
		variation: 'default',
		version: 'initial',
		primary: {
			content: [
				{
					type: 'paragraph',
					text,
					spans: spans.map(({ start, end, label }) => ({
						type: 'label',
						start,
						end,
						data: { label }
					}))
				}
			]
		},
		items: []
	} as unknown as RichTextSlice;
}

describe('RichText slice', () => {
	it('renders a codespan label as <code> with its text inside', () => {
		const { container } = render(RichText, {
			props: { slice: sliceWith('run pnpm build now', [{ start: 4, end: 14, label: 'codespan' }]) }
		});
		const code = container.querySelector('p > code');
		expect(code).not.toBeNull();
		expect(code?.textContent).toBe('pnpm build');
		expect(container.querySelector('p')?.textContent).toBe('run pnpm build now');
	});

	it('renders any other label as a <span> classed with the label name', () => {
		const { container } = render(RichText, {
			props: { slice: sliceWith('a highlighted word', [{ start: 2, end: 13, label: 'accent' }]) }
		});
		const span = container.querySelector('p > span.accent');
		expect(span).not.toBeNull();
		expect(span?.textContent).toBe('highlighted');
		expect(container.querySelector('code')).toBeNull();
	});
});
