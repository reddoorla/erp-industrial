<script lang='ts'>
	import { onMount } from "svelte";
	import { PrismicImage } from "@prismicio/svelte";
	import ContentWidth from "$lib/components/ContentWidth.svelte";
	import ContentBox from "$lib/components/ContentBox.svelte";
	import type { HeroSlice } from "../../../prismicio-types";
    let viewportWidth:number;
    let viewportHeight:number;

	export let slice:HeroSlice;

	const videoId = slice.primary.video_embed.embed_url.split('/').pop();

	let bottomPane:HTMLElement;

	// const sendToBottomPane = () =>{
	// 	if(bottomPane?.getBoundingClientRect().top>10){
	// 		bottomPane.parentElement?.scrollTo(0, viewportHeight*2)	
	// 	}
	// }

	// onMount(()=>{
	// 	bottomPane?.parentElement?.addEventListener("scroll", sendToBottomPane)
	// 	bottomPane?.parentElement?.scrollTo(0, viewportHeight/2)
	// })
    

</script>

<svelte:window bind:innerHeight={viewportHeight} bind:innerWidth={viewportWidth} />
  
  <div class="w-screen h-screen overflow-hidden snap-end fixed top-0">
	<PrismicImage field={slice.primary.loading_placeholder} class="object-cover absolute {viewportHeight*16 >viewportWidth*9 ? "h-full":"w-full"}"/>
	<iframe 
	  title="background video" 
	  src={`https://player.vimeo.com/video/${videoId}?background=1`}
	  class="object-cover absolute aspect-video {viewportHeight * 16 > viewportWidth * 9 ? 'h-full min-w-full' : 'w-full min-h-full'}"
	  frameborder="0"
	  allowfullscreen
	  
	></iframe>

	<ContentWidth class="h-full relative justify-end z-30">
		<div class="w-4/5 relative h-full flex flex-col justify-end mb-16">
		<ContentBox 
			titleText={slice.primary.title||""}
			titleTag="h1"
			float="left"
			class="text-white z-20 text-left"
		/>
		</div>
	</ContentWidth>
  </div>
  <div class="w-screen h-screen sticky snap-end overflow-hidden">

  </div>
