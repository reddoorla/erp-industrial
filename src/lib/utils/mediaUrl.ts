import { isFilled, type LinkField } from '@prismicio/client';

export function mediaUrl(field: LinkField | null | undefined): string | null {
	if (!field || !isFilled.link(field) || field.link_type !== 'Media') return null;
	return field.url ?? null;
}
