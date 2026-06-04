<script lang="ts">
	import { fade } from '$lib/transitions';
	import DefaultButton from './Buttons/DefaultButton.svelte';

	let {
		icon = '',
		iconAltText = 'logo',
		labelText = '',
		titleText = '',
		titleTag = 'h3',
		subtitleText = '',
		paragraphText = '',
		buttonText = '',
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
</script>

<!--
	Rendered unconditionally (no onMount gate) so the heading/body are in the server HTML — this is
	the LCP element on the hero and must not wait for hydration. The transitions below still play on
	client-side navigation (SvelteKit enables intros then); on first load they no-op, leaving content
	visible immediately.
-->
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
