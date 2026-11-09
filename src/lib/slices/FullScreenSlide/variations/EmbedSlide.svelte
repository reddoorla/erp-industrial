<script lang="ts">
	import ContentWidth from '$lib/components/ContentWidth.svelte';
	import { page } from '$app/state';
	import type { FullScreenSlideSliceEmbed } from '../../../../../prismicio-types';

	let { slice }: { slice: FullScreenSlideSliceEmbed } = $props();
</script>

<!-- The fixed nav's logo reaches 80px down on phones and 150px on md+ (it sits at the left, the
     links at y≈30). The centred heading fits beside the logo and the map starts below it at 152px;
     before, the logo and nav links sat over the listings panel and the map. -->
<div class="flex h-full flex-col pt-20 md:pt-24">
	<ContentWidth
		class="flex h-12 shrink-0 flex-col items-center justify-center overflow-hidden text-center md:h-14"
	>
		<h3 class="font-bold">{slice.primary.title}</h3>
	</ContentWidth>
	<div class="buildout-embed min-h-0 flex-1 overflow-hidden px-2 pb-6 md:px-0">
		{#key page.url.pathname}
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html slice.primary.external_embed}
		{/key}
	</div>
</div>

<style>
	/* Buildout injects a fixed-height iframe into the CMS embed HTML, which overflows the
	   full-page slide and gets clipped. Force the embed container + iframe to fill the
	   available height (as /buildout-map does) so Buildout scrolls its content internally. */
	.buildout-embed :global(#buildout) {
		/* override the inline `height: 80vh` baked into the CMS embed HTML so the map
		   fills the slide's available area instead of leaving a gap */
		height: 100% !important;
	}
	.buildout-embed :global(iframe) {
		width: 100% !important;
		height: 100% !important;
	}
</style>
