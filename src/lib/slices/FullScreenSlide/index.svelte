<script lang='ts'>
	import DefaultButton from "$lib/components/Buttons/DefaultButton.svelte";
	import ContentBox from "$lib/components/ContentBox.svelte";
	import ContentWidth from "$lib/components/ContentWidth.svelte";
	import FullPageSlide from "$lib/components/FullPageSlide.svelte";
	import { PrismicImage, PrismicRichText } from "@prismicio/svelte";
	import type { FullScreenSlideSlice } from "../../../prismicio-types";
	import { fade, fly } from "svelte/transition";
	import { onMount } from "svelte";
	import { isNavLight } from "$lib/stores/isNavLight";


	export let slice:FullScreenSlideSlice;

	let activeOverlay = -1;
	let section:HTMLElement|undefined;
	let isActiveSection = false;
	


	let videoId:string|undefined;
	if(slice.variation==="withVideoPopup"){
		videoId=slice.primary.video_embed.embed_url.split('/').pop();
		}

	const checkActive = () => {
		if(section)
			isActiveSection = section?.getBoundingClientRect().top<10;

		if(isActiveSection)
			isNavLight.set(slice.primary.isnavlight);
	}

	onMount( ()=> section?.parentElement?.addEventListener("scroll", checkActive));

</script>

<section bind:this={section} data-slice-type={slice.slice_type} data-slice-variation={slice.variation} class="snap-end sticky {slice.primary.doesStack?"top-0":""} bg-white overflow-hidden">
	<FullPageSlide backgroundImage={slice.variation==="embed" ? null : slice.primary.background_image }>
		{#if slice.variation==="embed"}
				<ContentWidth class="text-center h-32 md:h-56 flex flex-col justify-center items-center">
					<h3 class="font-bold">{slice.primary.title}</h3>
				</ContentWidth>
				<div class="h-[80vh]">
					{@html slice.primary.external_embed}
				</div>
		{:else if slice.variation==="halfPage"}
		<div class="bg-black absolute w-screen h-screen flex flex-col {slice.primary.isImageLeft?"lg:flex-row":"lg:flex-row-reverse"}">
			<PrismicImage field={slice.primary.background_image} class="lg:w-1/2 lg:h-full object-cover"/>
			{#if isActiveSection}
			<div class="lg:w-1/2 p-[12%]">
				<h5 transition:fade class="text-white mb-16">{slice.primary.eyebrow||""}</h5>
				<h2 transition:fade={{delay:200}} class="text-white">{slice.primary.title||""}</h2>
				<p transition:fly={{delay:400, y:20}} class="text-white">{slice.primary.body_text||""}</p>
			</div>
			{/if}
			
		</div>
				
			
		{:else if isActiveSection}

		<div class="absolute w-screen h-screen top-0 left-0" 
     		class:backdrop-blur={slice.primary.isBackgroundBlurred&&isActiveSection}
    	 transition:fade={{duration:1000}}>
		</div>
		<ContentWidth class="h-full relative justify-end z-30 pb-12 md:pb-32">
			<div class="{slice.variation!=="iconBoxes"&&slice.variation!=="teams"?"md:w-2/3":""} relative h-full flex flex-col justify-end mb-8 md:mb-16">
			<div transition:fade>
			{#if activeOverlay===-1}
			<div out:fade in:fade={{delay:300}}>
			<ContentBox 
				titleText={slice.primary.title||""}
				titleTag="h2"
				labelText={slice.primary.eyebrow||""}
				paragraphText={slice.primary.body_text||""}
				float="left"
				class="text-white z-10 text-left"
			/>
			</div>
			{/if}
			</div>
			<div class="flex flex-col md:flex-row gap-4" transition:fly={{y:20, delay:300}}>
				{#if slice.variation==="default"}
					{#each slice.items as item, i}
						<DefaultButton text={item.button_text||''} on:click={()=>activeOverlay=i}/>
					{/each}
				{/if}
				{#if slice.variation==="withVideoPopup"}
					<DefaultButton text="Watch" on:click={()=>{activeOverlay=0;}}/>
				{/if}
				{#if slice.variation==="iconBoxes"}
				<div class="w-full h-48 flex flex-row gap-8">
					{#each slice.items as item }
						<ContentBox 
							icon={item.icon.url||""}
							labelText={item.eyebrow||""}
							paragraphText={item.body_text||""}
							float="left"
							class="text-white"
						/>
					{/each}

				</div>
				{/if}

			{#if slice.variation==="teams"}

				<div class="w-full flex flex-col md:flex-row">
					{#each slice.items as item, i (i)}
					<div class="w-1/3 pr-8 flex flex-col gap-8 items-start justify-start">
					<PrismicImage field={item.headshot} class="w-48 rounded-full"/>
					<h6 class="text-white whitespace-pre-line">{item.title}</h6>
					<div class="large-paragraph text-white">{item.name}</div>
					<DefaultButton filled={false} on:click={()=>activeOverlay=i} text="bio"/>
				</div>
			{/each}

		</div>
{/if}

			</div>
			</div>
		</ContentWidth>
		{/if}
		{#if (slice.variation==="default"||slice.variation==="withVideoPopup"||slice.variation==="teams")&&activeOverlay!=-1 }
		<div class="w-screen h-screen top-0 left-0 fixed z-40 bg-black {slice.variation==="teams"?"":"bg-opacity-50"} backdrop-blur" in:fade={{delay:300}} out:fade>		
			{#if slice.variation==="default"}
			{#key activeOverlay}
			<div class="h-full w-full" out:fade in:fade={{delay:300}}>
					<ContentWidth class="h-full relative flex flex-col justify-end z-40 pb-12 md:pb-32">
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
				</div>
				{/key}
			{/if}
			{#if slice.variation==="withVideoPopup"&&videoId}
				<ContentWidth class="h-full flex justify-center items-center">
					<iframe 
	  					title="background video" 
	 					src={`https://player.vimeo.com/video/${videoId}?background=1&muted=0&autoplay=1`}
	  					class="object-cover aspect-video w-full md:w-4/5 mx-auto"
	  					frameborder="0"
						allow="autoplay"
						
					></iframe>
					<DefaultButton text="Close" class="absolute bottom-20" on:click={()=>activeOverlay=-1}/>
				</ContentWidth>
			{/if}
			{#if slice.variation==="teams"}
				{#key activeOverlay}
					<div class="h-full w-full" out:fade in:fade={{delay:300}}>
						<ContentWidth class="h-full relative flex flex-row justify-between z-40 pb-12 md:pb-32">
							<div class="w-1/4 flex flex-col justify-between pt-48">
								<div class="flex flex-col justify-between gap-8">
									<PrismicImage field={slice.items[activeOverlay].headshot} class="w-72 rounded-full"/>
									<h6 class="text-white whitespace-pre-line">{slice.items[activeOverlay].title}</h6>
									<div class="large-paragraph text-white">{slice.items[activeOverlay].name}</div>
								</div>
								<DefaultButton text="close" on:click={()=>activeOverlay=-1} filled={false}/>
							</div>
							
							<div class="w-1/2 text-white flex flex-col justify-end">
								<PrismicRichText field={slice.items[activeOverlay].body_text} />
							</div>
						</ContentWidth>
					</div>
					
				{/key}
			{/if}
		</div>
		{/if}

	</FullPageSlide>
</section>



