import { isNavLight } from '$lib/stores/isNavLight';

interface SlideObserverOptions {
	/** Whether the nav should render light (white) while this slide is the frontmost one on screen. */
	navLight: boolean;
	/** Called once, the first time the slide scrolls into view — use to latch entrance animations. */
	onEnter?: () => void;
}

/**
 * Registry of slides currently crossing the viewport centre, mapped to their desired nav colour.
 * Because stacking slides are `position: sticky; top: 0`, several pinned slides can geometrically
 * span the centre line at once (the ones underneath are simply covered). We always honour the
 * frontmost slide — i.e. the one latest in document order, which paints on top — so the nav colour
 * matches what the user actually sees instead of racing between stacked layers.
 */
const centred = new Map<HTMLElement, boolean>();

function applyFrontmostNavColour() {
	let frontmost: HTMLElement | null = null;
	for (const node of centred.keys()) {
		if (!frontmost || frontmost.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_FOLLOWING) {
			frontmost = node;
		}
	}
	if (frontmost) isNavLight.set(centred.get(frontmost)!);
}

/**
 * Drives a stacking slide's entrance + nav colour purely from IntersectionObserver — no scroll
 * listeners, no getBoundingClientRect-per-scroll, no position toggling. CSS `position: sticky`
 * owns the stacking itself, so this only reacts to visibility and never fights the layout.
 */
export function slideObserver(node: HTMLElement, options: SlideObserverOptions) {
	let { navLight } = options;
	let onEnter = options.onEnter;

	// Entrance: fire once when ~15% of the slide is visible, then stop observing (play-once).
	const enterObserver = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					onEnter?.();
					enterObserver.disconnect();
					break;
				}
			}
		},
		{ threshold: 0.15 }
	);
	enterObserver.observe(node);

	// Nav colour: track membership in the "crossing centre" set; recompute frontmost on each change.
	const centreObserver = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) centred.set(node, navLight);
				else centred.delete(node);
			}
			applyFrontmostNavColour();
		},
		{ rootMargin: '-50% 0px -50% 0px', threshold: 0 }
	);
	centreObserver.observe(node);

	return {
		update(next: SlideObserverOptions) {
			navLight = next.navLight;
			onEnter = next.onEnter;
			if (centred.has(node)) {
				centred.set(node, navLight);
				applyFrontmostNavColour();
			}
		},
		destroy() {
			enterObserver.disconnect();
			centreObserver.disconnect();
			centred.delete(node);
		}
	};
}
