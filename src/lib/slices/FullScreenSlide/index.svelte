<script lang='ts'>
	/** @type {import("@prismicio/client").Content.FullScreenSlideSlice} */
	import DefaultButton from "$lib/components/Buttons/DefaultButton.svelte";
	import ContentBox from "$lib/components/ContentBox.svelte";
	import ContentWidth from "$lib/components/ContentWidth.svelte";
	import FullPageSlide from "$lib/components/FullPageSlide.svelte";
	import { PrismicRichText } from "@prismicio/svelte";
	import type { FullScreenSlideSlice } from "../../../prismicio-types";
	import { fade, fly } from "svelte/transition";
	import { onMount } from "svelte";

	export let slice:FullScreenSlideSlice;

	let activeOverlay = -1;
	let section:HTMLElement|undefined;
	let isActiveSection = false;

	const checkActive = () =>{
		if(section)
			isActiveSection = section?.getBoundingClientRect().top<10;

			console.log('fired')
	}

	let videoId:string|undefined;
	if(slice.variation==="withVideoPopup")
		videoId=slice.primary.video_embed.embed_url.split('/').pop();

		onMount(()=>{
				section?.parentElement?.addEventListener("scroll", checkActive)
		})

</script>

<section bind:this={section} data-slice-type={slice.slice_type} data-slice-variation={slice.variation} class="sticky top-0 snap-start bg-white overflow-hidden">
	<FullPageSlide backgroundImage={slice.variation==="embed"?null:slice.primary.background_image}>
		{#if slice.variation==="embed"}
			
				<ContentWidth class="text-center h-32 md:h-56 flex flex-col justify-center items-center">
					<h3 class="font-bold">{slice.primary.title}</h3>
				</ContentWidth>
				{@html slice.primary.external_embed}
			
		{:else if isActiveSection}
		<ContentWidth class="h-full relative justify-end z-30 pb-8 md:pb-32">
			<div class="md:w-2/3 relative h-full flex flex-col justify-end mb-8 md:mb-16">
			<div transition:fade>
			<ContentBox 
				titleText={slice.primary.title||""}
				titleTag="h2"
				labelText={slice.primary.eyebrow||""}
				float="left"
				class="text-white z-10 text-left"
			/>
			</div>
			<div class="flex flex-col md:flex-row gap-4" transition:fly={{x:100,y:20}}>
				{#if slice.variation==="default"}
					{#each slice.items as item, i}
						<DefaultButton text={item.button_text||''} on:click={()=>activeOverlay=i}/>
					{/each}
				{/if}
				{#if slice.variation==="withVideoPopup"}
					<DefaultButton text="Watch" on:click={()=>activeOverlay=0}/>
				{/if}

			</div>
			</div>
		</ContentWidth>
		{/if}
		{#if (slice.variation==="default"||slice.variation==="withVideoPopup")&&activeOverlay!=-1 }
		<div class="w-screen h-screen top-0 left-0 fixed z-40 bg-black bg-opacity-50 backdrop-blur" transition:fade>		
			{#if slice.variation==="default"}
					<ContentWidth class="h-full relative flex flex-col justify-end z-40 pb-8 md:pb-32">
					<ContentBox 
						titleText={slice.items[activeOverlay].title||""}
						titleTag="h2"
						labelText={slice.items[activeOverlay].eyebrow||""}
						float="left"
						class="text-white z-10 text-left"
				/>
				<div class="text-white mb-12 md:w-160">
					<PrismicRichText field={slice.items[activeOverlay].body_text} />
				</div>
				<div class="flex flex-col md:flex-row gap-4">
						{#each slice.items as item, i}
							<DefaultButton text={activeOverlay==i?'close':item.button_text||''} 
								on:click={()=>{	
									if(activeOverlay==i){activeOverlay= -1}
									else{activeOverlay=i}}}/>
						{/each}
					</div>
				</ContentWidth>
			{/if}
			{#if slice.variation==="withVideoPopup"&&videoId}
				<ContentWidth class="h-full flex justify-center items-center">
					<iframe 
	  					title="background video" 
	 					src={`https://player.vimeo.com/video/${videoId}?background=1&muted=0`}
	  					class="object-cover aspect-video w-full md:w-4/5 mx-auto"
	  					frameborder="0"
					></iframe>
					<DefaultButton text="Close" class="absolute bottom-20" on:click={()=>activeOverlay=-1}/>
				</ContentWidth>
			{/if}
		</div>
		{/if}
	</FullPageSlide>
</section>
