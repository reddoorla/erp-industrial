<script lang='ts'>
	import Nav from '$lib/components/Nav.svelte';
	import * as prismicHelpers from "@prismicio/helpers"
	import { SliceZone } from '@prismicio/svelte';
	import { components } from '$lib/slices';
	import { text } from '@sveltejs/kit';
	import { onMount } from 'svelte';

	export let data;

	let navLinks=[{href:"",text:""}];
	let isLogoLarge = true;

	data.nav.data.links.forEach((link)=>{ navLinks.push({
			href: (prismicHelpers.isFilled.link(link.href) ? link.href.url||"#" : "#"),
			text: (link.text||"")
		})
	});

	onMount(()=>{
		window.addEventListener("scroll", ()=>{
			isLogoLarge = false;
		}, {once: true})
	})
</script>

<svelte:head>
    <title>ERP Industrial</title>
</svelte:head>

<Nav {navLinks} {isLogoLarge}/>

<SliceZone slices={data.page.data.slices} {components} />
