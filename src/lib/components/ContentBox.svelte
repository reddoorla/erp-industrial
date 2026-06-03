<script lang="ts">
	import { fade } from 'svelte/transition';
	import placeholderIcon from '../assets/fullLogo.png';
	import DefaultButton from './Buttons/DefaultButton.svelte';
	import { onMount } from 'svelte';

	let {
		icon = '',
		iconAltText = 'logo',
		labelText = '',
		titleText = '',
		titleTag = 'h3',
		subtitleText = '',
		paragraphText = '',
		buttonText = '',
		linkText = '',
		linkHref = '',
		backgroundColor = 'transparent',
		float = 'center',
		class: className = ''
	}: {
		icon?: string;
		iconAltText?: string;
		labelText?: string;
		titleText?: string;
		titleTag?: string;
		subtitleText?: string;
		paragraphText?: string;
		buttonText?: string;
		linkText?: string;
		linkHref?: string;
		backgroundColor?: string;
		float?: string;
		class?: string;
	} = $props();

	const justify = $derived.by(() => {
		if (float === 'left') return 'start';
		if (float === 'right') return 'end';
		return float;
	});

	const horizontalFloatMargin = $derived.by(() => {
		if (float === 'left') return 'ml-0 mr-auto';
		if (float === 'right') return 'ml-auto mr-0';
		return 'mx-auto';
	});

	let isMounted = $state(false);

	onMount(() => (isMounted = true));
</script>

{#if isMounted}
	<div
		class="w-full flex flex-col justify-{justify} text-{float} {className || ''}"
		style="background-color: {backgroundColor}"
	>
		{#if icon}
			<img src={icon} alt={iconAltText} class="w-[70px] h-[70px] mb-7 {horizontalFloatMargin}" />
		{/if}
		{#if labelText}
			<h5 transition:fade class="mb-7">{labelText}</h5>
		{/if}
		{#if titleText}
			{#if titleTag === 'h1'}
				<h1 transition:fade={{ delay: 200 }} class="mb-7">{titleText}</h1>
			{/if}
			{#if titleTag === 'h2'}
				<h2 transition:fade={{ delay: 200 }} class="mb-7">{titleText}</h2>
			{/if}
			{#if titleTag === 'h3'}
				<h3 transition:fade={{ delay: 200 }} class="mb-7">{titleText}</h3>
			{/if}
			{#if titleTag === 'h4'}
				<h4 transition:fade={{ delay: 200 }} class="mb-7">{titleText}</h4>
			{/if}
			{#if titleTag === 'h5'}
				<h5 transition:fade={{ delay: 200 }} class="mb-7">{titleText}</h5>
			{/if}
		{/if}
		{#if subtitleText}
			<h6 transition:fade={{ delay: 400 }} class="mb-7">{subtitleText}</h6>
		{/if}
		{#if paragraphText}
			<p transition:fade={{ delay: 600 }} class="mb-7 max-w-full whitespace-pre-line min-h-28">
				{paragraphText}
			</p>
		{/if}
		<div
			class="flex flex-nowrap text-nowrap flex-col sm:flex-row align-middle justify-center sm:justify-{justify}"
		>
			{#if buttonText}
				<DefaultButton text={buttonText} class="mr-5" />
			{/if}
		</div>
	</div>
{/if}
