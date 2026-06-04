<script lang="ts">
	import DefaultButton from '$lib/components/Buttons/DefaultButton.svelte';
	import ContentBox from '$lib/components/ContentBox.svelte';
	import ContentWidth from '$lib/components/ContentWidth.svelte';
	import SliderOfContentBoxes from '$lib/components/SliderOfContentBoxes.svelte';
	import { PrismicImage } from '@prismicio/svelte';
	import { fade, fly } from 'svelte/transition';
	import { isFilled } from '@prismicio/helpers';
	import type {
		FullScreenSlideSliceDefault,
		FullScreenSlideSliceWithVideoPopup,
		FullScreenSlideSliceIconBoxes,
		FullScreenSlideSliceBigText,
		FullScreenSlideSliceBasic,
		FullScreenSlideSliceTeams
	} from '../../../../prismicio-types';

	type StackedVariant =
		| FullScreenSlideSliceDefault
		| FullScreenSlideSliceWithVideoPopup
		| FullScreenSlideSliceIconBoxes
		| FullScreenSlideSliceBigText
		| FullScreenSlideSliceBasic
		| FullScreenSlideSliceTeams;

	let {
		slice,
		viewportWidth,
		activeOverlay = $bindable()
	}: { slice: StackedVariant; viewportWidth: number; activeOverlay: number } = $props();

	let contentBoxPropsArray = $state<
		{ icon: string; float: string; titleText: string; paragraphText: string }[]
	>([]);

	if (slice.variation === 'iconBoxes') {
		slice.items.forEach((item) => {
			contentBoxPropsArray.push({
				icon: item.icon.url || '',
				float: 'center',
				titleText: item.eyebrow || '',
				paragraphText: item.body_text || ''
			});
		});
	}
</script>

<div
	class="absolute w-screen h-dvh top-0 left-0"
	class:backdrop-blur={slice.primary.isBackgroundBlurred}
	transition:fade={{ duration: 1000 }}
></div>
<ContentWidth class="h-full relative justify-end z-30 overflow-hidden py-32">
	<div
		class="{slice.variation !== 'iconBoxes' && slice.variation !== 'teams'
			? 'lg:w-3/4'
			: ''} relative h-full flex flex-col justify-end mb-8 md:mb-16"
	>
		<div transition:fade>
			{#if activeOverlay === -1}
				<div out:fade in:fade={{ delay: 300 }}>
					{#if slice.variation !== 'bigText'}
						<ContentBox
							titleText={slice.primary.title || ''}
							titleTag="h2"
							labelText={slice.primary.eyebrow || ''}
							paragraphText={slice.primary.body_text || ''}
							float="left"
							class="text-white z-10 text-left"
						/>
					{:else}
						<h1 class="text-white my-6">{slice.primary.title || ''}</h1>
						<h5 class="text-white mb-16">{slice.primary.eyebrow || ''}</h5>
					{/if}
				</div>
			{/if}
		</div>
		<div class="flex flex-col md:flex-row gap-4" transition:fly={{ y: 20, delay: 300 }}>
			{#if slice.variation === 'default'}
				{#each slice.items as item, i (i)}
					{#if isFilled.link(item.button_link)}
						<DefaultButton text={item.button_text || ''} href={item.button_link.url} />
					{:else}
						<DefaultButton text={item.button_text || ''} onclick={() => (activeOverlay = i)} />
					{/if}
				{/each}
			{/if}
			{#if slice.variation === 'withVideoPopup' && activeOverlay === -1}
				<DefaultButton
					text="Watch"
					onclick={() => {
						activeOverlay = 0;
					}}
				/>
			{/if}
			{#if slice.variation === 'iconBoxes'}
				<div class="w-full flex flex-col md:flex-row gap-8 h-80">
					{#if viewportWidth > 768}
						{#each slice.items as item, i (i)}
							<ContentBox
								icon={item.icon.url || ''}
								labelText={item.eyebrow || ''}
								paragraphText={item.body_text || ''}
								class="text-white h-full justify-between text-left"
								float="left"
							/>
						{/each}
					{:else}
						<SliderOfContentBoxes {contentBoxPropsArray} />
					{/if}
				</div>
			{/if}
			{#if (slice.variation === 'basic' && viewportWidth >= 768) || slice.variation === 'bigText'}
				<div class="flex flex-col md:flex-row gap-8">
					{#if slice.primary.button_text_1}
						<DefaultButton
							text={slice.primary.button_text_1 || ''}
							href={isFilled.link(slice.primary.button_link_1)
								? slice.primary.button_link_1.url
								: ''}
						/>
					{/if}
					{#if slice.primary.button_text_2}
						<DefaultButton
							text={slice.primary.button_text_2 || ''}
							href={isFilled.link(slice.primary.button_link_2)
								? slice.primary.button_link_2.url
								: ''}
						/>
					{/if}
				</div>
			{/if}

			{#if slice.variation === 'teams'}
				<div
					class="w-full h-dvh pt-64 flex flex-col md:flex-row gap-8 overflow-y-auto md:overflow-hidden py-32 md:pb-0"
				>
					<div class="text-white large-paragraph md:absolute md:top-8">Management Team</div>
					{#each slice.items as item, i (i)}
						<div class="md:w-1/3 pr-8 flex flex-col gap-8 md:items-start md:justify-end shrink-0">
							<PrismicImage field={item.headshot} class="md:w-48 rounded-full" />
							<h5 class="text-white whitespace-pre-line">{item.title}</h5>
							<div class="large-paragraph text-white whitespace-nowrap">{item.name}</div>
							<DefaultButton filled={false} onclick={() => (activeOverlay = i)} text="bio" />
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</ContentWidth>
