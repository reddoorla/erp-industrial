<script lang='ts'>
	import { PrismicEmbed, PrismicImage } from "@prismicio/svelte";
	import ContentWidth from "$lib/components/ContentWidth.svelte";
	import ContentBox from "$lib/components/ContentBox.svelte";
	import type { HeroSlice } from "../../../prismicio-types";
    let viewportWidth:number;
    let viewportHeight:number;

	export let slice:HeroSlice;

	const videoId = slice.primary.video_embed.embed_url.split('/').pop();
    

</script>

<svelte:window bind:innerHeight={viewportHeight} bind:innerWidth={viewportWidth} />
  
  <div class="w-screen h-screen overflow-hidden  sticky top-0 snap-start">
	<iframe 
	  title="background video" 
	  src={`https://player.vimeo.com/video/${videoId}?background=1`}
	  class="object-cover absolute aspect-video {viewportHeight * 16 > viewportWidth * 9 ? 'h-full min-w-full' : 'w-full min-h-full'}"
	  frameborder="0"
	  allowfullscreen
	  
	></iframe>

	<ContentWidth class="h-full relative justify-end z-30">
		<div class="w-2/3 relative h-full flex flex-col justify-end mb-16">
		<ContentBox 
			titleText={slice.primary.title||""}
			titleTag="h1"
			float="left"
			class="text-white z-20 text-left"
		/>
		</div>
	</ContentWidth>
  </div>