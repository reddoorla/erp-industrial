<script lang="ts">
	import { PrismicPreview } from '@prismicio/svelte/kit';
	import { page } from '$app/stores';
	import { repositoryName } from '$lib/prismicio';
	import "../app.css"
	import Footer from '$lib/components/Footer.svelte';


import { onMount } from 'svelte';
import { afterNavigate, disableScrollHandling } from '$app/navigation';

afterNavigate(() => {
    disableScrollHandling();
    setTimeout(() => {
        scrollTo({ top: 0, behavior: 'instant' });
    }, 50);
});
	let isSnappy = true;


</script>

<style>


</style>

<svelte:head>
	<title>{$page.data.title}</title>
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


<main class="{isSnappy ? "snap-y snap-mandatory" : ""} h-screen overflow-scroll m-0 scroll-smooth overscroll-none">

	<slot />
	
</main>
<PrismicPreview {repositoryName} />
