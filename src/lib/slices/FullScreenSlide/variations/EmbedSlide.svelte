<script lang="ts">
	import ContentWidth from '$lib/components/ContentWidth.svelte';
	import { page } from '$app/state';
	import type { FullScreenSlideSliceEmbed } from '../../../../../prismicio-types';

	let { slice }: { slice: FullScreenSlideSliceEmbed } = $props();
</script>

<!-- Laid out as the "Build Out Map" frame in the ERP Website Design file: the heading centred
     under the nav, then the Buildout widget inside the site's content column, so its edges line up
     with the logo on the left and the nav on the right, with air below it before the footer.
     The fixed nav's logo reaches 80px down on phones and 150px on md+ (it sits at the left, the
     links at y≈30), so the centred heading sits beside it and the widget starts below it. -->
<div class="flex h-full flex-col pt-20 md:pt-24">
	<ContentWidth
		class="flex h-12 shrink-0 flex-col items-center justify-center overflow-hidden text-center md:h-14"
	>
		<h3 class="font-bold">{slice.primary.title}</h3>
	</ContentWidth>
	<ContentWidth
		class="buildout-embed min-h-0 flex-1 overflow-hidden pt-2 pb-8 md:pt-4 md:pb-12 xl:w-full"
	>
		{#key page.url.pathname}
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html slice.primary.external_embed}
		{/key}
	</ContentWidth>
</div>

<style>
	/* Global, because .buildout-embed reaches the DOM through ContentWidth's class prop, which
	   Svelte's scoping does not hash (scoped, these rules matched nothing and the iframe fell back
	   to 150px). Buildout injects a fixed-height iframe into the CMS embed HTML, which overflows
	   the slide and gets clipped. Force the embed container + iframe to fill the available height
	   (as /buildout-map does) so Buildout scrolls its content internally. */
	:global(.buildout-embed #buildout) {
		/* override the inline `height: 80vh` baked into the CMS embed HTML so the map
		   fills the slide's available area instead of leaving a gap */
		height: 100% !important;
	}
	:global(.buildout-embed iframe) {
		width: 100% !important;
		height: 100% !important;
	}
</style>
