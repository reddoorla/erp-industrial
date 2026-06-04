<script lang="ts">
	import DefaultButton from '$lib/components/Buttons/DefaultButton.svelte';
	import ContentBox from '$lib/components/ContentBox.svelte';
	import ContentWidth from '$lib/components/ContentWidth.svelte';
	import { PrismicImage, PrismicRichText } from '@prismicio/svelte';
	import { fade } from 'svelte/transition';
	import type { FullScreenSlideSlice } from '../../../../prismicio-types';

	let {
		slice,
		viewportWidth,
		activeOverlay = $bindable()
	}: { slice: FullScreenSlideSlice; viewportWidth: number; activeOverlay: number } = $props();

	let videoId = $state<string | undefined>(undefined);
	if (slice.variation === 'withVideoPopup') {
		videoId = slice.primary.video_embed.embed_url.split('/').pop();
	}
</script>

<div
	class="w-screen h-dvh top-0 left-0 fixed z-40 bg-black {slice.variation === 'teams'
		? ''
		: 'bg-opacity-50'} backdrop-blur-sm"
	in:fade={{ delay: 300 }}
	out:fade
>
	{#if slice.variation === 'default'}
		{#key activeOverlay}
			<div class="h-full w-full" out:fade in:fade={{ delay: 300 }}>
				<ContentWidth
					class="h-full relative flex flex-col justify-end z-40 overflow-y-auto md:overflow-hidden py-32 md:pb-8"
				>
					<ContentBox
						titleText={slice.items[activeOverlay].title || ''}
						titleTag="h2"
						labelText={slice.items[activeOverlay].eyebrow || ''}
						float="left"
						class="text-white z-10 text-left"
					/>
					<div class="text-white mb-12 md:w-160">
						<PrismicRichText field={slice.items[activeOverlay].body_text} />
					</div>
					<div class="flex flex-col md:flex-row gap-4 mx-[4%] md:mx-0">
						{#each slice.items as item, i (i)}
							<DefaultButton
								text={activeOverlay == i ? 'close' : item.button_text || ''}
								onclick={() => {
									if (activeOverlay == i) {
										activeOverlay = -1;
									} else {
										activeOverlay = i;
									}
								}}
							/>
						{/each}
					</div>
				</ContentWidth>
			</div>
		{/key}
	{/if}
	{#if slice.variation === 'withVideoPopup' && videoId}
		<ContentWidth
			class="h-full flex justify-center items-center overflow-y-auto md:overflow-hidden py-32 md:pb-8"
		>
			<i
				class="absolute left-1/2 right-1/2 fa fa-spin fa-circle-o-notch fa-xl -translate-x-full -translate-y-full scale-[200%] text-white w-6 leading-6"
			></i>

			{#if viewportWidth > 1024}
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

			<DefaultButton
				text="Close"
				class="absolute bottom-4 mx-[4%] md:mx-auto max-w-[92%]"
				onclick={() => (activeOverlay = -1)}
			/>
		</ContentWidth>
	{/if}
	{#if slice.variation === 'teams'}
		{#key activeOverlay}
			<div class="h-full w-full" out:fade in:fade={{ delay: 300 }}>
				<ContentWidth
					class="h-dvh relative flex flex-col md:flex-row justify-start py-32 overflow-y-auto md:overflow-hidden md:justify-between z-40 pb-12 md:py-32"
				>
					<div class="w-full md:w-1/4 flex flex-col justify-between md:pt-24">
						<div class="flex w-full flex-col justify-between gap-8 md:pb-12">
							<PrismicImage
								field={slice.items[activeOverlay].headshot}
								class=" w-36 h-36 md:h-72  md:w-72 rounded-full max-w-none"
							/>
							<h5 class="text-white whitespace-pre-line">
								{slice.items[activeOverlay].title}
							</h5>
							<div class="large-paragraph text-white whitespace-nowrap">
								{slice.items[activeOverlay].name}
							</div>
						</div>
						<div class="hidden md:block">
							<DefaultButton
								text="close"
								onclick={() => (activeOverlay = -1)}
								filled={false}
								class="h-12 "
							/>
						</div>
					</div>

					<div class="min-h-96 my-8 md:w-1/2 text-white flex flex-col overflow-y-scroll items-end">
						<PrismicRichText field={slice.items[activeOverlay].body_text} />
					</div>
					<div class="md:hidden pb-64">
						<DefaultButton
							text="close"
							onclick={() => (activeOverlay = -1)}
							filled={false}
							class="h-12"
						/>
					</div>
				</ContentWidth>
			</div>
		{/key}
	{/if}
</div>
