<script lang="ts">
	/* global BuildOut */
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
	import Nav from '$lib/components/Nav.svelte';
	import * as prismicHelpers from '@prismicio/helpers';
	import { SliceZone } from '@prismicio/svelte';
	import { components } from '$lib/slices';
	import Footer from '$lib/components/Footer.svelte';
	import { onMount } from 'svelte';

	import { afterNavigate, disableScrollHandling } from '$app/navigation';

	afterNavigate(() => {
		disableScrollHandling();
		setTimeout(() => {
			scrollTo({ top: 0, behavior: 'instant' });
		}, 50);
	});

	let navLinks = $state([{ href: '', text: '' }]);
	let isLogoLarge = $state(true);

	import type { NavDocumentDataLinksItem } from '../../prismicio-types';
	data.nav.data.links.forEach((link: NavDocumentDataLinksItem) => {
		navLinks.push({
			href: prismicHelpers.isFilled.link(link.href) ? link.href.url || '#' : '#',
			text: link.text || ''
		});
	});

	onMount(() => {
		document.getElementsByTagName('main')[0].addEventListener(
			'scroll',
			() => {
				isLogoLarge = false;
			},
			{ once: true }
		);
		// @ts-expect-error BuildOut global injected by external script
		BuildOut.embed({
			token: 'bdecc802689ae7f3e2007fdaf2ffdb31f711a99e',
			plugin: 'inventory',
			target: 'buildout'
		});
	});
</script>

<svelte:head>
	<title>ERP Industrials</title>
</svelte:head>

<Nav {navLinks} bind:isLogoLarge />

<SliceZone slices={data.page.data.slices} {components} />

<Footer />
