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
	import SliderOfContentBoxes from "$lib/components/SliderOfContentBoxes.svelte";
	import { page } from "$app/stores";
	import { isFilled } from "@prismicio/helpers";


	export let slice:FullScreenSlideSlice;

	let activeOverlay = -1;
	let section:HTMLElement|undefined;
	let isActiveSection = false;
	let viewportWidth:number;
	


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

	onMount( () => section?.parentElement?.addEventListener("scroll", checkActive));


	let contentBoxPropsArray:any[]=[];

	if(slice.variation==="iconBoxes"){
		slice.items.forEach((item)=>{
			contentBoxPropsArray.push({
				icon:item.icon.url||"",
				float:"center",
				titleText: item.eyebrow||"",
				paragraphText:item.body_text||""
			})
		})
	}

</script>

<svelte:window bind:innerWidth={viewportWidth} />


<section bind:this={section} data-slice-type={slice.slice_type} data-slice-variation={slice.variation} class="snap-end sticky {slice.primary.doesStack?"top-0":""} {slice.variation==="embed"? "bg-white" : "bg-black"} overflow-hidden" in:fade={{delay:400}} out:fade>
	<FullPageSlide backgroundImage={slice.variation==="embed" ? null : slice.primary.background_image } >
		{#if slice.variation==="embed"}
				<ContentWidth class="text-center h-12 md:h-56 flex flex-col justify-center items-center overflow-hidden py-10 md:pb-0">
					<h3 class="font-bold">{slice.primary.title}</h3>
				</ContentWidth>
				<div class="overflow-y-auto overflow-x-hidden md:-translate-y-12 mb-32">
					{#key $page.url.pathname}
						{@html slice.primary.external_embed}
					{/key}
				</div>
		{:else if slice.variation==="halfPage"||slice.variation==="halfPageWithButtonOverlays"}
		<div class="bg-black absolute w-screen h-screen flex flex-col {slice.primary.isImageLeft?"lg:flex-row":"lg:flex-row-reverse"}">
			<PrismicImage field={slice.primary.background_image} class="lg:w-1/2 h-1/4 lg:h-full object-cover"/>
			{#if isActiveSection}
			<div class="h-3/4 lg:h-auto lg:w-1/2 p-[4%] md:p-[12%] overflow-y-auto md:overflow-hidden py-32 md:pb-0">
				{#if activeOverlay===-1}
				<h5 transition:fade class="text-white mb-16">{slice.primary.eyebrow||""}</h5>
				<h2 in:fade={{delay:600}} out:fade class="text-white whitespace-pre-line my-8">{slice.primary.title||""}</h2>
				<p in:fly={{delay:800, y:20}} out:fade class="text-white">{slice.primary.body_text||""}</p>
				<div in:fly={{delay:900, y:20}} out:fade class="flex flex-col gap-8 my-16">
					{#each slice.items as item, i (i) }
						{#if isFilled.link(item.button_link)}
							<DefaultButton text={item.button_text||""} href={(isFilled.link(item.button_link)?item.button_link.url:"")} filled={false}/>
						{:else}
							<DefaultButton text={item.button_text||""} on:click={()=>activeOverlay=i} filled={false}/>
						{/if}
					{/each}
				</div>
				{:else if slice.variation==="halfPageWithButtonOverlays"}
					<h5 in:fade={{delay:401}} out:fade class="text-white mb-16">{slice.items[activeOverlay].overlay_subtitle||""}</h5>
					<h2 in:fade={{delay:401}} out:fade class="text-white whitespace-pre-line my-8">{slice.items[activeOverlay].overlay_title||""}</h2>
					<p in:fly={{delay:600, y:20}} out:fade class="text-white"><PrismicRichText field={slice.items[activeOverlay].overlay_body} /></p>
					<div in:fly={{delay:800, y:20}} out:fade class="mt-8">
						<DefaultButton text={"Go Back"} on:click={()=>activeOverlay=-1} filled={false}/>
					</div>
					
					<button transition:fade  class="absolute top-8 right-16 bump hover:opacity-80 transition-opacity" on:click={()=>activeOverlay=-1}>
						<i class="fa-solid fa-close fa-xl text-white" />
					</button>
					
				{/if}
			</div>
			{/if}
			
		</div>
				
			
		{:else if isActiveSection}

		<div class="absolute w-screen h-screen top-0 left-0" 
     		class:backdrop-blur={slice.primary.isBackgroundBlurred&&isActiveSection}
    	 transition:fade={{duration:1000}}>
		</div>
		<ContentWidth class="h-full relative justify-end z-30 overflow-hidden py-32">
			<div class="{slice.variation!=="iconBoxes"&&slice.variation!=="teams"?"lg:w-3/4":""} relative h-full flex flex-col justify-end mb-8 md:mb-16">
			<div transition:fade>
			{#if activeOverlay===-1}
			<div out:fade in:fade={{delay:300}}>
			{#if slice.variation!=="bigText"}
			<ContentBox 
				titleText={slice.primary.title||""}
				titleTag="h2"
				labelText={slice.primary.eyebrow||""}
				paragraphText={slice.primary.body_text||""}
				float="left"
				class="text-white z-10 text-left"
			/>
			{:else}
				<h1 class="text-white my-6">{slice.primary.title||""}</h1>
				<h5 class="text-white mb-16">{slice.primary.eyebrow||""}</h5>
			{/if}
			</div>
			{/if}
			</div>
			<div class="flex flex-col md:flex-row gap-4" transition:fly={{y:20, delay:300}}>
				{#if slice.variation==="default"}
					{#each slice.items as item, i}
					{#if isFilled.link(item.button_link)}
						<DefaultButton text={item.button_text||''} href={item.button_link.url}/>
					{:else}
						<DefaultButton text={item.button_text||''} on:click={()=>activeOverlay=i}/>
					{/if}
					{/each}
				{/if}
				{#if slice.variation==="withVideoPopup"&&activeOverlay===-1}
							<!-- {#if viewportWidth<1024}
								<DefaultButton text="Watch" href={"https://vimeo.com/"+slice.primary.video_embed.embed_url.split('/').pop()}/>
							{:else}
								<DefaultButton text="Watch" on:click={()=>{activeOverlay=0;}}/>
							{/if} -->
							<DefaultButton text="Watch" on:click={()=>{activeOverlay=0;}}/>
				{/if}
				{#if slice.variation==="iconBoxes"}
				<div class="w-full flex flex-col md:flex-row gap-8 h-80">
					{#if viewportWidth>768}
					{#each slice.items as item }
						
						<ContentBox 
							icon={item.icon.url||""}
							labelText={item.eyebrow||""}
							paragraphText={item.body_text||""}
							class="text-white h-full justify-between"
						/>
					
					{/each}
					{:else}
					<SliderOfContentBoxes {contentBoxPropsArray}/>
					{/if}

				</div>
				{/if}
				{#if slice.variation==="basic"||slice.variation==="bigText"}
					<div class="flex flex-col md:flex-row gap-8">
						{#if slice.primary.button_text_1}
							<DefaultButton text={slice.primary.button_text_1||""} href={(isFilled.link(slice.primary.button_link_1)?slice.primary.button_link_1.url:"")}/>
						{/if}
						{#if slice.primary.button_text_2}
							<DefaultButton text={slice.primary.button_text_2||""} href={(isFilled.link(slice.primary.button_link_2)?slice.primary.button_link_2.url:"")}/>
						{/if}
					</div>
				{/if}

			{#if slice.variation==="teams"}

			<div class="w-full h-screen pt-64 flex flex-col md:flex-row gap-8 overflow-y-auto md:overflow-hidden py-32 md:pb-0">
				<div class="text-white large-paragraph">
					Management Team
				</div>
				{#each slice.items as item, i (i)}
					<div class="md:w-1/3 pr-8 flex flex-col gap-8 md:items-start md:justify-end flex-shrink-0">
						<PrismicImage field={item.headshot} class="md:w-48 rounded-full"/>
						<h5 class="text-white whitespace-pre-line">{item.title}</h5>
						<div class="large-paragraph text-white whitespace-nowrap">{item.name}</div>
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
					<ContentWidth class="h-full relative flex flex-col justify-end z-40 overflow-y-auto md:overflow-hidden py-32 md:pb-0">
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
				<div class="flex flex-col md:flex-row gap-4 mx-[4%] md:mx-0" >
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
				<ContentWidth class="h-full flex justify-center items-center overflow-y-auto md:overflow-hidden py-32 md:pb-0">
					<i class="absolute left-1/2 right-1/2 fa fa-spin fa-circle-o-notch fa-xl -translate-x-full -translate-y-full scale-[200%] text-white w-6 leading-6"/>
				
					{#if viewportWidth>1024}
					<iframe 
	  					title="background video" 
	 					src={`https://player.vimeo.com/video/${videoId}?background=1&muted=0&autoplay=1`}
	  					class="object-cover aspect-video w-full md:w-4/5 mx-auto z-10"
	  					frameborder="0"
						allow="autoplay"
						
					></iframe>
					{:else}
					<iframe 
	  					title="background video" 
	 					src={`https://player.vimeo.com/video/${videoId}`}
	  					class="object-cover aspect-video w-full md:w-4/5 mx-auto z-10"
	  					frameborder="0"
						
					></iframe>
					{/if}
				
					
					<DefaultButton text="Close" class="absolute bottom-20 mx-[4%] md:mx-auto max-w-[92%]" on:click={()=>activeOverlay=-1}/>
				</ContentWidth>
			{/if}
			{#if slice.variation==="teams"}
				{#key activeOverlay}
					<div class="h-full w-full" out:fade in:fade={{delay:300}}>
						<ContentWidth class="h-screen relative flex flex-col md:flex-row justify-start py-32 overflow-y-auto md:overflow-hidden md:justify-between z-40 pb-12 md:py-32">
							<div class="w-full md:w-1/4 flex flex-col justify-between  md:pt-24">
								<div class="flex w-full flex-col justify-between gap-8 md:pb-12">
									<PrismicImage field={slice.items[activeOverlay].headshot} class=" w-36 h-36 md:h-72  md:w-72 rounded-full max-w-none"/>
									<h5 class="text-white whitespace-pre-line">{slice.items[activeOverlay].title}</h5>
									<div class="large-paragraph text-white whitespace-nowrap">{slice.items[activeOverlay].name}</div>
								</div>
								<div class="hidden md:block">
									<DefaultButton text="close" on:click={()=>activeOverlay=-1} filled={false} class="h-12 "/>
								</div>
							</div>
							
							<div class="md:w-1/2 text-white flex flex-col justify-end items-end py-32">
								<PrismicRichText field={slice.items[activeOverlay].body_text} />
							</div>
							<div class="md:hidden pb-64">
								<DefaultButton text="close" on:click={()=>activeOverlay=-1} filled={false} class="h-12"/>
							</div>
						</ContentWidth>
					</div>
					
				{/key}
			{/if}
		</div>
		{/if}

	</FullPageSlide>
</section>

