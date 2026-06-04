<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import ContentBox from './ContentBox.svelte';
	import type { ComponentProps } from 'svelte';

	let {
		contentBoxPropsArray = [] as ComponentProps<typeof ContentBox>[]
	}: { contentBoxPropsArray?: ComponentProps<typeof ContentBox>[] } = $props();

	const SLIDER_INTERVAL_IN_MS = 5000;
	let sliderIndex = $state(0);
	let sliderInterval: ReturnType<typeof setInterval>;
	let sliderWidth = $derived(100 / contentBoxPropsArray.length / 5);
	let isSlideAnimated = $state(true);

	const resetSlider = () => {
		setTimeout(() => (isSlideAnimated = false), 500);
		setTimeout(() => (sliderIndex = contentBoxPropsArray.length), 520);
		setTimeout(() => (isSlideAnimated = true), 540);
	};

	const slideLeft = () => {
		sliderIndex++;
		clearInterval(sliderInterval);
		sliderInterval = setInterval(() => slideLeft(), SLIDER_INTERVAL_IN_MS);
		if (sliderIndex % contentBoxPropsArray.length == 0 && sliderIndex !== 0) resetSlider();
	};

	const slideRight = () => {
		sliderIndex--;
		clearInterval(sliderInterval);

		sliderInterval = setInterval(() => slideRight(), SLIDER_INTERVAL_IN_MS);
		if (sliderIndex % contentBoxPropsArray.length == 0 && sliderIndex !== 0 && sliderIndex < 0)
			resetSlider();
	};

	onMount(() => {
		sliderInterval = setInterval(() => slideLeft(), SLIDER_INTERVAL_IN_MS);
	});

	onDestroy(() => clearInterval(sliderInterval));

	const quintupledPropsArray = $derived([
		...contentBoxPropsArray,
		...contentBoxPropsArray,
		...contentBoxPropsArray,
		...contentBoxPropsArray,
		...contentBoxPropsArray
	]);
</script>

<div class="w-full h-full relative overflow-hidden">
	<div
		class="flex flex-row flex-nowrap {isSlideAnimated
			? 'transition-transform duration-500 ease-in-out'
			: ''}"
		style="width: {quintupledPropsArray.length * 100}%; transform: translateX(-{(sliderIndex +
			contentBoxPropsArray.length) *
			sliderWidth}%);"
	>
		{#each quintupledPropsArray as contentBoxProps, i (i)}
			<div class="h-full z-0" style="width: {sliderWidth}%;">
				<ContentBox {...contentBoxProps} class="text-white" />
			</div>
		{/each}
	</div>
	<div
		class=" h-6 w-full flex justify-between z-10 absolute bottom-0 lg:bottom-[20%] xl:bottom-[30%] left-0"
	>
		<button
			onclick={slideRight}
			class="text-white flex align-middle justify-center cursor-pointer transition-all duration-300 active:-translate-y-2 hover:text-black"
			aria-label="Previous slide"
		>
			<i class="fa-sharp fa-solid fa-chevron-left fa-2x" aria-hidden="true"></i>
		</button>
		<div class="h-10 flex align-middle justify-start">
			{#each contentBoxPropsArray as _image, i (i)}
				<button
					class="h-[10px] w-[10px] border-2 rounded-full transition-colors duration-1000 cursor-pointer active:translate-y-[-0.5px] hover:opacity-60 mr-4
            {(sliderIndex % contentBoxPropsArray.length >= 0 &&
						sliderIndex % contentBoxPropsArray.length === i) ||
					(sliderIndex % contentBoxPropsArray.length <= 0 &&
						contentBoxPropsArray.length + (sliderIndex % contentBoxPropsArray.length) === i)
						? 'bg-dark border-dark'
						: 'border-light bg-light'}"
					onclick={() => (sliderIndex = i)}
					aria-label="Go to slide {i + 1}"
				></button>
			{/each}
		</div>
		<button
			onclick={slideLeft}
			class="text-white flex align-middle cursor-pointer transition-all duration-300 active:-translate-y-2 justify-center translate-y-[-5.5px] hover:text-black"
			aria-label="Next slide"
		>
			<i class="fa-sharp fa-solid fa-chevron-right fa-2x" aria-hidden="true"></i>
		</button>
	</div>
</div>
