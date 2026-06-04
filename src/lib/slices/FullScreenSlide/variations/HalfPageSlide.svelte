<script lang="ts">
	import DefaultButton from '$lib/components/Buttons/DefaultButton.svelte';
	import { PrismicImage, PrismicRichText } from '@prismicio/svelte';
	import { fade, fly } from '$lib/transitions';
	import { isFilled } from '@prismicio/helpers';
	import type {
		FullScreenSlideSliceHalfPage,
		FullScreenSlideSliceHalfPageWithButtonOverlays,
		FullScreenSlideSliceBasic
	} from '../../../../prismicio-types';

	type HalfPageSlideVariant =
		| FullScreenSlideSliceHalfPage
		| FullScreenSlideSliceHalfPageWithButtonOverlays
		| FullScreenSlideSliceBasic;

	let {
		slice,
		hasEntered,
		activeOverlay = $bindable()
	}: { slice: HalfPageSlideVariant; hasEntered: boolean; activeOverlay: number } = $props();
</script>

<div
	class="bg-black absolute w-screen h-dvh flex flex-col {//@ts-expect-error isImageLeft exists on halfPage variation only
	slice.primary.isImageLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'}"
>
	<PrismicImage
		field={slice.primary.background_image}
		class="lg:w-1/2 h-1/4 lg:h-full object-cover"
	/>
	{#if hasEntered}
		<div
			class="h-3/4 lg:h-auto lg:w-1/2 p-[4%] md:p-[6%] overflow-y-scroll md:overflow-hidden py-32 mt-32 md:pb-0"
		>
			{#if activeOverlay === -1}
				<h5 transition:fade class="text-white mb-16">{slice.primary.eyebrow || ''}</h5>
				<h2 in:fade={{ delay: 600 }} out:fade class="text-white whitespace-pre-line my-8">
					{slice.primary.title || ''}
				</h2>
				<p in:fly={{ delay: 800, y: 20 }} out:fade class="text-white">
					{slice.primary.body_text || ''}
				</p>
				<div in:fly={{ delay: 900, y: 20 }} out:fade class="flex flex-col gap-8 my-16">
					{#each slice.items as item, i (i)}
						{#if isFilled.link(item.button_link)}
							<DefaultButton
								text={item.button_text || ''}
								href={isFilled.link(item.button_link) ? item.button_link.url : ''}
								filled={false}
							/>
						{:else}
							<DefaultButton
								text={item.button_text || ''}
								onclick={() => (activeOverlay = i)}
								filled={false}
							/>
						{/if}
					{/each}
				</div>
			{:else if slice.variation === 'halfPageWithButtonOverlays'}
				<h5 in:fade={{ delay: 401 }} out:fade class="text-white mb-16">
					{slice.items[activeOverlay].overlay_subtitle || ''}
				</h5>
				<h2 in:fade={{ delay: 401 }} out:fade class="text-white whitespace-pre-line my-8">
					{slice.items[activeOverlay].overlay_title || ''}
				</h2>
				<p in:fly={{ delay: 600, y: 20 }} out:fade class="text-white">
					<PrismicRichText field={slice.items[activeOverlay].overlay_body} />
				</p>
				<div in:fly={{ delay: 800, y: 20 }} out:fade class="mt-8">
					<DefaultButton text="Go Back" onclick={() => (activeOverlay = -1)} filled={false} />
				</div>

				<button
					transition:fade
					class="absolute top-8 right-16 bump hover:opacity-80 transition-opacity"
					onclick={() => (activeOverlay = -1)}
					aria-label="Close"
				>
					<i class="fa-solid fa-close fa-xl text-white" aria-hidden="true"></i>
				</button>
			{/if}
		</div>
	{/if}
</div>
