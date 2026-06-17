<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ImageFieldImage } from '@prismicio/client';
	import { ArrowUp } from '@lucide/svelte';
	import { PrismicImage } from '@prismicio/svelte';

	let {
		backgroundImage = null,
		children
	}: { backgroundImage?: ImageFieldImage | null; children?: Snippet } = $props();

	let viewportWidth = $state(0);
	let viewportHeight = $state(0);
</script>

<svelte:window bind:innerHeight={viewportHeight} bind:innerWidth={viewportWidth} />

<div class="w-screen h-dvh overflow-hidden relative">
	{#if backgroundImage}
		<PrismicImage
			field={backgroundImage}
			loading="lazy"
			imgixParams={{ auto: ['format', 'compress'] }}
			class="object-cover absolute w-screen h-dvh left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
		/>
		<div
			class="w-full h-full absolute top-0 left-0"
			style="background: linear-gradient(180deg, rgba(0, 0, 0, 0.00) 14.68%, rgba(0, 0, 0, 0.50) 69.9%)"
		></div>
		<ArrowUp
			class="rotate-180 text-white opacity-40 absolute bottom-32 md:bottom-8 right-8 size-[1.5em]"
			strokeWidth={1.75}
		/>
	{/if}

	{@render children?.()}
</div>
