<script lang="ts">
	import { PrismicPreview } from '@prismicio/svelte/kit';
	import { page } from '$app/stores';
	import { repositoryName } from '$lib/prismicio';
	import '../app.css';

	import { afterNavigate, goto, beforeNavigate } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import type { Snippet } from 'svelte';
	import LandscapeModal from '$lib/components/LandscapeModal.svelte';

	let { children }: { children?: Snippet } = $props();

	let main: HTMLElement;
	let isSnappy = $state(true);
	let isTransitioning = $state(false);

	beforeNavigate(({ cancel, to }) => {
		if (!isTransitioning && to?.route.id) {
			cancel();
			isTransitioning = true;
			if (to) setTimeout(() => goto(to.url), 400);
		}
	});

	afterNavigate(() => {
		setTimeout(() => {
			main.scrollTo({ top: 0, behavior: 'instant' });
		}, 400);

		setTimeout(() => {
			isTransitioning = false;
		}, 800);

		if (document) {
			Array.from(document.getElementsByClassName('grecaptcha-badge')).forEach((e) => {
				e.remove();
			});
		}
	});
</script>

<svelte:head>
	<title>{$page.data.title || 'ERP Industrials'}</title>
	{#if $page.data.meta_description}
		<meta name="description" content={$page.data.meta_description} />
	{/if}
	{#if $page.data.meta_title}
		<meta name="og:title" content={$page.data.meta_title} />
	{/if}
	{#if $page.data.meta_image}
		<meta name="og:image" content={$page.data.meta_image} />
		<meta name="twitter:card" content="summary_large_image" />
	{/if}
</svelte:head>

<main
	bind:this={main}
	class="{isSnappy
		? 'snap-y snap-proximity'
		: ''} h-dvh overflow-scroll m-0 scroll-smooth overscroll-none"
>
	{@render children?.()}
</main>
{#if isTransitioning}
	<div class="w-screen h-dvh bg-black fixed top-0 left-0 z-40" transition:fade></div>
{/if}

<LandscapeModal />
<PrismicPreview {repositoryName} />
