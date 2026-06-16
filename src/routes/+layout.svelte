<script lang="ts">
	import { PrismicPreview } from '@prismicio/svelte/kit';
	import { page } from '$app/stores';
	import { repositoryName } from '$lib/prismicio';
	import '../app.css';

	import { afterNavigate, goto, beforeNavigate } from '$app/navigation';
	import { fade } from '$lib/transitions';
	import type { Snippet } from 'svelte';
	import LandscapeModal from '$lib/components/LandscapeModal.svelte';

	let { children }: { children?: Snippet } = $props();

	let main: HTMLElement;
	let isSnappy = $state(true);
	let isTransitioning = $state(false);

	// Custom fade-to-black route transition: cancel the nav, show the overlay, then re-issue the
	// real navigation after the fade. navTimer/pendingUrl keep it robust to interruption.
	let navTimer: ReturnType<typeof setTimeout> | undefined;
	let pendingUrl: string | undefined;

	beforeNavigate(({ cancel, to, from }) => {
		if (!to?.route.id) return; // external / unmatched route — navigate normally, no overlay
		if (from && to.url.pathname === from.url.pathname) return; // same page (hash/query) — no fade

		// Our own deferred goto reaching its target: let it proceed (don't re-defer → no loop).
		if (isTransitioning && pendingUrl === to.url.href) return;

		// First navigation, or a new click mid-transition: (re-)defer to the newest destination so
		// rapid clicks land on the last one clicked instead of double-navigating.
		cancel();
		isTransitioning = true;
		pendingUrl = to.url.href;
		clearTimeout(navTimer);
		navTimer = setTimeout(() => {
			// If the navigation errors/redirects (no afterNavigate fires), clear the overlay so it can't stick.
			goto(to.url).catch(() => {
				isTransitioning = false;
				pendingUrl = undefined;
			});
		}, 400);
	});

	afterNavigate(() => {
		setTimeout(() => {
			main?.scrollTo({ top: 0, behavior: 'instant' });
		}, 400);

		setTimeout(() => {
			isTransitioning = false;
			pendingUrl = undefined;
		}, 800);
	});
</script>

<svelte:head>
	<title>{$page.data.title || 'ERP Industrials'}</title>
	{#if $page.data.meta_description}
		<meta name="description" content={$page.data.meta_description} />
	{/if}
	{#if $page.data.meta_title}
		<meta property="og:title" content={$page.data.meta_title} />
	{/if}
	{#if $page.data.meta_image}
		<meta property="og:image" content={$page.data.meta_image} />
		<meta name="twitter:card" content="summary_large_image" />
	{/if}
	<link rel="canonical" href={$page.url.origin + $page.url.pathname} />
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
