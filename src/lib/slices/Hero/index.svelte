<script lang='ts'>
	import { onMount } from "svelte";
	import { fade } from "svelte/transition"
	import { PrismicImage } from "@prismicio/svelte";
	import ContentWidth from "$lib/components/ContentWidth.svelte";
	import ContentBox from "$lib/components/ContentBox.svelte";
	import type { HeroSlice } from "../../../prismicio-types";
	import { isNavLight } from "$lib/stores/isNavLight";
    let viewportWidth:number;
    let viewportHeight:number;

	import DefaultButton from "$lib/components/Buttons/DefaultButton.svelte";

	export let slice:HeroSlice;

	let videoId="";

	if(slice.primary.video_embed.embed_url)
		videoId = slice.primary.video_embed?.embed_url.split('/').pop()||"";

	let bottomPane:HTMLElement;

	let isMounted = false;

	// const sendToBottomPane = () =>{
	// 	if(bottomPane?.getBoundingClientRect().top>10){
	// 		bottomPane.parentElement?.scrollTo(0, viewportHeight*2)	
	// 	}
	// }

		onMount(()=>{
			isMounted=true;
			isNavLight.set(slice.primary.isnavlight)
		})
    

</script>

<svelte:window bind:innerHeight={viewportHeight} bind:innerWidth={viewportWidth} />
  
  <div class="w-screen h-screen overflow-hidden snap-end fixed top-0">

	<PrismicImage field={slice.primary.loading_placeholder} class="object-cover absolute aspect-video {viewportHeight*16 >viewportWidth*9 ? 'h-full min-w-full' : 'w-full min-h-full'}"/>
	{#if videoId}
	<iframe 
	  title="background video" 
	  src={`https://player.vimeo.com/video/${videoId}?background=1`}
	  class="object-cover absolute aspect-video {viewportHeight * 16 > viewportWidth * 9 ? 'h-screen min-w-full' : 'w-screen min-h-full'}"
	  frameborder="0"
	  allowfullscreen
	  
	></iframe>
	{:else}
	<div transition:fade class="w-full h-full absolute top-0 left-0" style="background: linear-gradient(180deg, rgba(0, 0, 0, 0.00) 14.68%, rgba(0, 0, 0, 0.50) 69.9%)"></div>
  
	{/if}


	<ContentWidth class="h-full relative justify-end z-30">
		<div class="w-4/5 max-w-[720px] relative h-full flex flex-col justify-end pb-32">
		{#if isMounted}
		<div transition:fade>
		<ContentBox 
			titleText={slice.primary.title||""}
			titleTag="h1"
			paragraphText={slice.primary.body_text||""}
			float="left"
			class="text-white z-20 text-left"
		/>
		{#if slice.primary.button_text}
			<DefaultButton text={slice.primary.button_text || ''} href={slice.primary.button_link}/>
		{/if}
	</div>
		{/if}
		</div>
	</ContentWidth>
  </div>
  <div class="w-screen h-screen sticky snap-end overflow-hidden">

  </div>
