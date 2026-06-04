<script lang="ts">
	import FullPageSlide from '$lib/components/FullPageSlide.svelte';
	import { slideObserver } from '$lib/actions/slideObserver';
	import { fade } from '$lib/transitions';
	import type { FullScreenSlideSlice } from '../../../prismicio-types';
	import EmbedSlide from './variations/EmbedSlide.svelte';
	import HalfPageSlide from './variations/HalfPageSlide.svelte';
	import StackedContent from './variations/StackedContent.svelte';
	import SlideOverlay from './variations/SlideOverlay.svelte';

	let { slice }: { slice: FullScreenSlideSlice } = $props();

	let activeOverlay = $state(-1);
	// Latches true the first time the slide scrolls into view, so entrance transitions play exactly
	// once and never replay on the way back up. CSS `position: sticky` handles the stacking itself.
	let hasEntered = $state(false);
	let viewportWidth = $state(0);

	const hasOverlay = $derived(
		(slice.variation === 'default' ||
			slice.variation === 'withVideoPopup' ||
			slice.variation === 'teams') &&
			activeOverlay !== -1
	);
</script>

<svelte:window bind:innerWidth={viewportWidth} />

<section
	use:slideObserver={{ navLight: slice.primary.isnavlight, onEnter: () => (hasEntered = true) }}
	data-slice-type={slice.slice_type}
	data-slice-variation={slice.variation}
	style="position: {slice.primary.doesStack ? 'sticky' : 'relative'}"
	class="snap-start {slice.primary.doesStack ? 'top-0' : ''} {slice.variation === 'embed'
		? 'bg-white'
		: 'bg-black'} overflow-hidden"
	in:fade={{ delay: 400 }}
	out:fade
>
	<FullPageSlide
		backgroundImage={slice.variation === 'embed' ? null : slice.primary.background_image}
	>
		{#if slice.variation === 'embed'}
			<EmbedSlide {slice} />
		{:else if slice.variation === 'halfPage' || slice.variation === 'halfPageWithButtonOverlays' || (slice.variation === 'basic' && viewportWidth < 768)}
			<HalfPageSlide {slice} {hasEntered} bind:activeOverlay />
		{:else if hasEntered}
			<StackedContent {slice} {viewportWidth} bind:activeOverlay />
		{/if}

		{#if hasOverlay}
			<SlideOverlay {slice} {viewportWidth} bind:activeOverlay />
		{/if}
	</FullPageSlide>
</section>
