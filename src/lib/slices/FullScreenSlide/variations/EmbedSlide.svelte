<script lang="ts">
	import ContentWidth from '$lib/components/ContentWidth.svelte';
	import { page } from '$app/stores';
	import type { FullScreenSlideSliceEmbed } from '../../../../prismicio-types';

	let { slice }: { slice: FullScreenSlideSliceEmbed } = $props();
</script>

<div class="flex h-full flex-col">
	<ContentWidth
		class="flex h-16 shrink-0 flex-col items-center justify-center overflow-hidden text-center md:h-24"
	>
		<h3 class="font-bold">{slice.primary.title}</h3>
	</ContentWidth>
	<div class="buildout-embed min-h-0 flex-1 overflow-hidden px-2 pb-6 md:px-0 md:pb-10">
		{#key $page.url.pathname}
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
