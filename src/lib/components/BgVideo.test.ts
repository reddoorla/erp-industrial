import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/svelte';
import { tick } from 'svelte';
import BgVideo from './BgVideo.svelte';

type MediaListener = (e: { matches: boolean }) => void;

let reducedMotion = false;
const mediaListeners = new Set<MediaListener>();
let playSpy: ReturnType<typeof vi.spyOn>;
let pauseSpy: ReturnType<typeof vi.spyOn>;

type IOCallback = (entries: Array<{ isIntersecting: boolean }>) => void;
let io: IOCallback | undefined;
let observed: Element | undefined;
let disconnected = false;

beforeEach(() => {
	reducedMotion = false;
	mediaListeners.clear();
	io = undefined;
	observed = undefined;
	disconnected = false;
	window.IntersectionObserver = class {
		constructor(cb: IOCallback) {
			io = cb;
		}
		observe(el: Element) {
			observed = el;
		}
		disconnect() {
			disconnected = true;
		}
		unobserve() {}
		takeRecords() {
			return [];
		}
		root = null;
		rootMargin = '';
		thresholds = [];
	} as unknown as typeof IntersectionObserver;
	window.matchMedia = vi.fn().mockImplementation((query: string) => ({
		matches: query.includes('prefers-reduced-motion') ? reducedMotion : false,
		media: query,
		addEventListener: (_: string, cb: MediaListener) => mediaListeners.add(cb),
		removeEventListener: (_: string, cb: MediaListener) => mediaListeners.delete(cb)
	}));
	playSpy = vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(function (
		this: HTMLMediaElement
	) {
		this.dispatchEvent(new Event('play'));
		return Promise.resolve();
	});
	pauseSpy = vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(function (
		this: HTMLMediaElement
	) {
		this.dispatchEvent(new Event('pause'));
	});
});

afterEach(() => {
	cleanup();
	vi.restoreAllMocks();
});

const props = { mp4: '/v/hero.mp4', webm: '/v/hero.webm', poster: '/p.jpg' };

describe('BgVideo', () => {
	it('does not autoplay from the server markup, so motion starts only after the preference is read', () => {
		const { container } = render(BgVideo, { props });
		const video = container.querySelector('video')!;
		expect(video.hasAttribute('autoplay')).toBe(false);
		expect(video.muted).toBe(true);
	});

	it('plays once near the viewport and offers a pause control (WCAG 2.2.2)', async () => {
		const { getByRole } = render(BgVideo, { props });
		await tick();
		io!([{ isIntersecting: true }]);
		await tick();
		expect(playSpy).toHaveBeenCalledTimes(1);
		const control = getByRole('button', { name: 'Pause background video' });
		await fireEvent.click(control);
		expect(pauseSpy).toHaveBeenCalled();
		expect(getByRole('button', { name: 'Play background video' })).toBeTruthy();
		await fireEvent.click(getByRole('button', { name: 'Play background video' }));
		expect(playSpy).toHaveBeenCalledTimes(2);
		expect(getByRole('button', { name: 'Pause background video' })).toBeTruthy();
	});

	it('stays still under prefers-reduced-motion', async () => {
		reducedMotion = true;
		const { getByRole } = render(BgVideo, { props });
		await tick();
		expect(playSpy).not.toHaveBeenCalled();
		expect(getByRole('button', { name: 'Play background video' })).toBeTruthy();
	});

	it('pauses when reduced motion is switched on after load', async () => {
		const { getByRole } = render(BgVideo, { props });
		await tick();
		io!([{ isIntersecting: true }]);
		await tick();
		for (const listener of mediaListeners) listener({ matches: true });
		await tick();
		expect(pauseSpy).toHaveBeenCalled();
		expect(getByRole('button', { name: 'Play background video' })).toBeTruthy();
	});

	it('keeps offering play when the browser refuses to start the video', async () => {
		playSpy.mockRejectedValue(new Error('NotAllowedError'));
		const { findByRole } = render(BgVideo, { props });
		await tick();
		io!([{ isIntersecting: true }]);
		expect(await findByRole('button', { name: 'Play background video' })).toBeTruthy();
	});

	it("follows the video's own state when something else pauses it", async () => {
		const { container, getByRole } = render(BgVideo, { props });
		await tick();
		io!([{ isIntersecting: true }]);
		await tick();
		container.querySelector('video')!.dispatchEvent(new Event('pause'));
		await tick();
		expect(getByRole('button', { name: 'Play background video' })).toBeTruthy();
	});

	it('does not claim to be playing before the video has started', async () => {
		playSpy.mockImplementation(() => new Promise(() => {}));
		const { getByRole } = render(BgVideo, { props });
		await tick();
		io!([{ isIntersecting: true }]);
		await tick();
		expect(getByRole('button', { name: 'Play background video' })).toBeTruthy();
	});

	it('offers no control when there is no video to play', async () => {
		const { queryByRole } = render(BgVideo, { props: { mp4: null, webm: null, poster: '/p.jpg' } });
		await tick();
		expect(queryByRole('button')).toBeNull();
	});

	describe('near the viewport', () => {
		it('waits for the video to come near the viewport before it plays', async () => {
			const { container } = render(BgVideo, { props });
			await tick();
			expect(observed).toBe(container.querySelector('video'));
			expect(playSpy).not.toHaveBeenCalled();
			io!([{ isIntersecting: true }]);
			expect(playSpy).toHaveBeenCalledTimes(1);
		});

		it('pauses when it leaves the viewport and resumes when it returns', async () => {
			render(BgVideo, { props });
			await tick();
			io!([{ isIntersecting: true }]);
			io!([{ isIntersecting: false }]);
			expect(pauseSpy).toHaveBeenCalledTimes(1);
			io!([{ isIntersecting: true }]);
			expect(playSpy).toHaveBeenCalledTimes(2);
		});

		it("keeps a visitor's pause across scrolling away and back", async () => {
			const { getByRole } = render(BgVideo, { props });
			await tick();
			io!([{ isIntersecting: true }]);
			await tick();
			await fireEvent.click(getByRole('button', { name: 'Pause background video' }));
			io!([{ isIntersecting: false }]);
			io!([{ isIntersecting: true }]);
			expect(playSpy).toHaveBeenCalledTimes(1);
			await fireEvent.click(getByRole('button', { name: 'Play background video' }));
			expect(playSpy).toHaveBeenCalledTimes(2);
		});

		it('never plays under reduced motion, even in view', async () => {
			reducedMotion = true;
			render(BgVideo, { props });
			await tick();
			io!([{ isIntersecting: true }]);
			expect(playSpy).not.toHaveBeenCalled();
		});

		it('stops observing on unmount', async () => {
			const { unmount } = render(BgVideo, { props });
			await tick();
			unmount();
			expect(disconnected).toBe(true);
		});

		it('plays at mount where there is no IntersectionObserver', async () => {
			delete (window as { IntersectionObserver?: unknown }).IntersectionObserver;
			render(BgVideo, { props });
			await tick();
			expect(playSpy).toHaveBeenCalledTimes(1);
		});
	});

	it('offers the phone rendition first, behind a media query, so a phone never fetches the desktop file', () => {
		const { container } = render(BgVideo, {
			props: { ...props, mobileMp4: '/v/hero-720.mp4' }
		});
		const sources = [...container.querySelectorAll('source')];
		expect(sources.map((s) => s.getAttribute('src'))).toEqual([
			'/v/hero-720.mp4',
			'/v/hero.webm',
			'/v/hero.mp4'
		]);
		expect(sources[0].getAttribute('media')).toBe('(max-width: 767px)');
		expect(sources[1].getAttribute('media')).toBeNull();
	});

	it('offers a control when only the phone rendition is set', async () => {
		const { getByRole } = render(BgVideo, {
			props: { mp4: null, webm: null, mobileMp4: '/v/hero-720.mp4', poster: null }
		});
		await tick();
		expect(getByRole('button')).toBeTruthy();
	});
});
