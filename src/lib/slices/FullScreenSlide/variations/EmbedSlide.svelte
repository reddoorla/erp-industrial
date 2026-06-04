<script lang="ts">
	import ContentWidth from '$lib/components/ContentWidth.svelte';
	import { page } from '$app/stores';
	import type { FullScreenSlideSliceEmbed } from '../../../../prismicio-types';

	let { slice }: { slice: FullScreenSlideSliceEmbed } = $props();
</script>

<ContentWidth
	class="text-center h-12 md:h-56 flex flex-col justify-center items-center overflow-hidden py-10 md:pb-0"
>
	<h3 class="font-bold">{slice.primary.title}</h3>
</ContentWidth>
<div class="overflow-y-auto overflow-x-hidden md:-translate-y-12 mb-32">
	{#key $page.url.pathname}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html slice.primary.external_embed}
	{/key}
</div>
