<script lang="ts">
	import { PrismicPreview } from '@prismicio/svelte/kit';
	import { page } from '$app/stores';
	import { repositoryName } from '$lib/prismicio';
	import "../app.css"
	import Footer from '$lib/components/Footer.svelte';



import { afterNavigate, beforeNavigate, disableScrollHandling } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';

let main:HTMLElement

beforeNavigate(()=>	isTransitioning=true)


afterNavigate(() => {
    disableScrollHandling();

    setTimeout(() => {
        main.scrollTo({ top: 0, behavior: 'instant' });
    }, 400);

	setTimeout(()=>{
		isTransitioning=false;
	},800)
});
	let isSnappy = true;

	let isTransitioning = false;

	


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

<main bind:this={main} class="{isSnappy ? "snap-y snap-mandatory" : ""} h-screen overflow-scroll m-0 scroll-smooth overscroll-none">

	<slot />
	
</main>
{#if isTransitioning}
<div class="w-screen h-screen bg-black fixed" in:fade out:fade={{duration:2000}}></div>
{/if}
<PrismicPreview {repositoryName} />
