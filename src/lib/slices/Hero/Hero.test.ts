import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, cleanup } from '@testing-library/svelte';
import Hero from './index.svelte';
import type { HeroSlice } from '../../../prismicio-types';

vi.mock('@vimeo/player', () => ({
	default: class {
		setQuality() {
			return Promise.resolve();
		}
		on() {}
		destroy() {
			return Promise.resolve();
		}
	}
}));

afterEach(() => cleanup());

const media = (name: string) => ({
	link_type: 'Media' as const,
	key: name,
	kind: 'file',
	id: name,
	url: `https://cdn.example/${name}`,
	name,
	size: '1'
});

function slice(withFiles: boolean): HeroSlice {
	return {
		slice_type: 'hero',
		slice_label: null,
		variation: 'default',
		version: 'initial',
		id: 'hero$1',
		items: [],
		primary: {
			title: 'Industrial real estate',
			body_text: 'Body',
			isnavlight: false,
			button_text: null,
			button_link: { link_type: 'Any' },
			loading_placeholder: {
				id: 'p',
				url: 'https://images.prismic.io/erp/p.jpg?auto=format,compress',
				alt: null,
				copyright: null,
				dimensions: { width: 2560, height: 1440 },
				edit: { x: 0, y: 0, zoom: 1, background: 'transparent' }
			},
			video_embed: {
				embed_url: 'https://vimeo.com/939245404',
				type: 'video',
				provider_name: 'Vimeo',
				html: '<iframe></iframe>'
			},
			video_mp4: withFiles ? media('erp-intro-1080.mp4') : { link_type: 'Media' },
			video_webm: withFiles ? media('erp-intro-1080.webm') : { link_type: 'Media' },
			video_mp4_mobile: withFiles ? media('erp-intro-phone-720.mp4') : { link_type: 'Media' }
		}
	} as unknown as HeroSlice;
}

describe('Hero background video', () => {
	it('keeps the Vimeo embed while the video files are empty', () => {
		const { container } = render(Hero, { props: { slice: slice(false) } });
		const iframe = container.querySelector('iframe');
		expect(iframe?.getAttribute('src')).toContain('player.vimeo.com/video/939245404');
		expect(container.querySelector('video')).toBeNull();
	});

	it('plays its own files, with no Vimeo frame, once they are set', () => {
		const { container } = render(Hero, { props: { slice: slice(true) } });
		expect(container.querySelector('iframe')).toBeNull();
		const sources = [...container.querySelectorAll('video source')].map((s) =>
			s.getAttribute('src')
		);
		expect(sources).toEqual([
			'https://cdn.example/erp-intro-phone-720.mp4',
			'https://cdn.example/erp-intro-1080.webm',
			'https://cdn.example/erp-intro-1080.mp4'
		]);
		expect(container.querySelector('video')?.getAttribute('poster')).toContain('w=1920');
	});
});
