<script lang='ts'>
	import { onMount } from "svelte";
	import { fade } from "svelte/transition"
	import { PrismicImage } from "@prismicio/svelte";
	import ContentWidth from "$lib/components/ContentWidth.svelte";
	import ContentBox from "$lib/components/ContentBox.svelte";
	import type { HeroSlice } from "../../../prismicio-types";

    let viewportWidth:number;
    let viewportHeight:number;

	import DefaultButton from "$lib/components/Buttons/DefaultButton.svelte";
	import { isFilled } from "@prismicio/helpers";

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
			setTimeout(()=>isMounted=true,25)

		})

		let hoveredElements: Set<HTMLElement> = new Set();

const handleMouseMove = (event: MouseEvent) => {
  const elementsUnder = document.elementsFromPoint(event.clientX, event.clientY);
  const currentHoveredElements: Set<HTMLElement> = new Set(
	elementsUnder.filter(
	  (element) => element !== event.currentTarget
	) as HTMLElement[]
  );

  // Dispatch mouseout event for elements no longer hovered
  hoveredElements.forEach((element) => {
	if (!currentHoveredElements.has(element)) {
		if(element.tagName==="A"&&!element.classList.contains('nav-link')){
		element.classList.remove('bg-erp-blue');
		element.classList.add('bg-black');
		document.getElementsByTagName("body")[0].style.cursor = "auto";
		}
	}
  });

  // Dispatch mouseover event for newly hovered elements
  currentHoveredElements.forEach((element) => {
	if (!hoveredElements.has(element)) {
		if(element.tagName==="A"&&!element.classList.contains('nav-link')){
		element.classList.remove('bg-black');
		element.classList.add('bg-erp-blue');
		document.getElementsByTagName("body")[0].style.cursor = "pointer";

	}
	}
  });

 
  hoveredElements = currentHoveredElements;
};


	const handleClick = (event:MouseEvent) => {
    // Manually propagate the click event to the elements underneath
    const elementsUnder = document.elementsFromPoint(event.clientX, event.clientY);
    elementsUnder.forEach((element : Element) => {
      if (element !== event.currentTarget) {
        (element as HTMLElement).click();
      }
    });
  }
    

</script>

<svelte:window bind:innerHeight={viewportHeight} bind:innerWidth={viewportWidth} />
{#key slice}
  
  <div class="w-screen h-screen overflow-hidden snap-end fixed top-0" in:fade={{delay:400}} out:fade>
	

	<PrismicImage field={slice.primary.loading_placeholder} class="object-cover absolute aspect-video {viewportHeight*16 >viewportWidth*9 ? 'h-full min-w-full' : 'w-full min-h-full'}"/>
	{#if videoId&&isFilled.embed(slice.primary.video_embed)&&viewportWidth>768}
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
		<div class="md:w-11/12 max-w-screen-lg relative h-full flex flex-col justify-end overflow-hidden py-12 lg:py-32">
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
			<DefaultButton text={slice.primary.button_text || ''} href={(isFilled.link(slice.primary.button_link)?slice.primary.button_link.url : "")}/>
		{/if}
	</div>
		{/if}
		</div>
	</ContentWidth>
  </div>
  <div class="w-screen h-screen sticky snap-end overflow-hidden" on:click={handleClick} on:mousemove={handleMouseMove} aria-hidden >
	<i class="fa-sharp fa-regular fa-arrow-up rotate-180 text-white opacity-40 fa-xl absolute bottom-8 right-8" />
  </div>

  {/key}