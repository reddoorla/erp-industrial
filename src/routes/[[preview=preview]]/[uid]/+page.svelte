<script lang='ts'>
	import Nav from '$lib/components/Nav.svelte';
	import * as prismicHelpers from "@prismicio/helpers"
	import { SliceZone } from '@prismicio/svelte';
	import { components } from '$lib/slices';
	import { onMount } from 'svelte';
	import { isNavLight } from '$lib/stores/isNavLight.js';

	export let data;

	let navLinks=[{href:"",text:""}];
	let isLogoLarge = true;
	if(data.page.uid==="contact"){
		isLogoLarge=false;
		isNavLight.set(true)
		
}
	data.nav.data.links.forEach((link)=>{ navLinks.push({
			href: (prismicHelpers.isFilled.link(link.href) ? link.href.url||"#" : "#"),
			text: (link.text||"")
		})
	});

	onMount(()=>{
		document.getElementsByTagName('main')[0].addEventListener("scroll", ()=>{
			isLogoLarge = false;
		}, {once: true})
	})
</script>

<svelte:head> 
    <title>ERP Industrial</title>
</svelte:head>

<Nav {navLinks} bind:isLogoLarge={isLogoLarge}/>

<SliceZone slices={data.page.data.slices} {components} />
