<script lang='ts'>
	import Nav from '$lib/components/Nav.svelte';
	import * as prismicHelpers from "@prismicio/helpers"
	import { SliceZone } from '@prismicio/svelte';
	import { components } from '$lib/slices';
	import { onMount } from 'svelte';
	import { isNavLight } from '$lib/stores/isNavLight.js';
	import { fade } from 'svelte/transition';
	import Footer from '$lib/components/Footer.svelte';




	export let data;

	let navLinks=[{href:"",text:""}];
	let isLogoLarge = true;

	data.nav.data.links.forEach((link)=>{ navLinks.push({
			href: (prismicHelpers.isFilled.link(link.href) ? link.href.url||"#" : "#"),
			text: (link.text||"")
		})
	});

	let isMounted = false;

	onMount(()=>{
		document.getElementsByTagName('main')[0].addEventListener("scroll", ()=>{
			isLogoLarge = false;
		}, {once: true});

		isMounted = true;

	})

	$: {
	data;
	if(isMounted)
	setTimeout(() => {
        scrollTo({ top: 0, behavior: 'instant' });
    }, 50);

}
</script>

<svelte:head> 
    <title>ERP Industrial</title>
</svelte:head>

<Nav {navLinks} bind:isLogoLarge={isLogoLarge}/>

<SliceZone slices={data.page.data.slices} {components} />

<Footer />