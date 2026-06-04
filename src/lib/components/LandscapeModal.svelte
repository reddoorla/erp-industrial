<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from '$lib/transitions';

	let showLandscapeModal = $state(false);

	onMount(() => {
		// Only nudge phone-sized devices in landscape: very wide aspect ratio AND short AND touch.
		// Tablets in landscape have a taller, less extreme ratio (height ≥ ~700px), so they're left
		// alone and get the full layout.
		const mql = window.matchMedia(
			'(orientation: landscape) and (min-aspect-ratio: 3/2) and (max-height: 500px) and (pointer: coarse)'
		);
		const update = () => (showLandscapeModal = mql.matches);
		update();
		mql.addEventListener('change', update);
		return () => mql.removeEventListener('change', update);
	});
</script>

{#if showLandscapeModal}
	<div
		transition:fade
		class="w-screen h-dvh fixed bg-black flex justify-center items-center top-0 left-0 z-50"
	>
		<h3 class="text-white">Please Switch to Portrait Mode</h3>
	</div>
{/if}
