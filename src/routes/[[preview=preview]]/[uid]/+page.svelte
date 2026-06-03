<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
	import Nav from '$lib/components/Nav.svelte';
	import * as prismicHelpers from '@prismicio/helpers';
	import { SliceZone } from '@prismicio/svelte';
	import { components } from '$lib/slices';
	import { onMount } from 'svelte';
	import { isNavLight } from '$lib/stores/isNavLight.js';
	import { fade } from 'svelte/transition';
	import Footer from '$lib/components/Footer.svelte';

	let navLinks = $state([{ href: '', text: '' }]);
	let isLogoLarge = $state(true);

	import type { NavDocumentDataLinksItem } from '../../../prismicio-types';
	data.nav.data.links.forEach((link: NavDocumentDataLinksItem) => {
		navLinks.push({
			href: prismicHelpers.isFilled.link(link.href) ? link.href.url || '#' : '#',
			text: link.text || ''
		});
	});

	let isMounted = $state(false);

	onMount(() => {
		document.getElementsByTagName('main')[0].addEventListener(
			'scroll',
			() => {
				isLogoLarge = false;
			},
			{ once: true }
		);

		isMounted = true;
	});
</script>

<svelte:head>
	<title>ERP Industrials</title>
</svelte:head>

<Nav {navLinks} bind:isLogoLarge />

<SliceZone slices={data.page.data.slices} {components} />

<Footer />
