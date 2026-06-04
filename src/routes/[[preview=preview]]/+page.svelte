<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
	import Nav from '$lib/components/Nav.svelte';
	import * as prismicHelpers from '@prismicio/helpers';
	import { SliceZone } from '@prismicio/svelte';
	import { components } from '$lib/slices';
	import Footer from '$lib/components/Footer.svelte';
	import { withBuildOut } from '$lib/buildout';
	import { onMount } from 'svelte';

	import { afterNavigate, disableScrollHandling } from '$app/navigation';

	afterNavigate(() => {
		disableScrollHandling();
		setTimeout(() => {
			scrollTo({ top: 0, behavior: 'instant' });
		}, 50);
	});

	let isLogoLarge = $state(true);

	import type { NavDocumentDataLinksItem } from '../../prismicio-types';
	const navLinks = $derived(
		data.nav.data.links.map((link: NavDocumentDataLinksItem) => ({
			href: prismicHelpers.isFilled.link(link.href) ? link.href.url || '#' : '#',
			text: link.text || ''
		}))
	);

	onMount(() => {
		document.getElementsByTagName('main')[0].addEventListener(
			'scroll',
			() => {
				isLogoLarge = false;
			},
			{ once: true }
		);
		// Only embed if an embed slice actually rendered the #buildout target; otherwise the script
		// initialises against a missing element. The returned cancel stops the poll on unmount.
		const cancelBuildOut = document.getElementById('buildout')
			? withBuildOut((BuildOut) =>
					BuildOut.embed({
						token: 'bdecc802689ae7f3e2007fdaf2ffdb31f711a99e',
						plugin: 'inventory',
						target: 'buildout'
					})
				)
			: undefined;
		return () => cancelBuildOut?.();
	});
</script>

<Nav {navLinks} bind:isLogoLarge />

<SliceZone slices={data.page.data.slices} {components} />

<Footer />
