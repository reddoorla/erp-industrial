<script lang="ts">
	import { onMount } from 'svelte';
	import Pause from '@lucide/svelte/icons/pause';
	import Play from '@lucide/svelte/icons/play';

	type Props = {
		mp4?: string | null;
		webm?: string | null;
		mobileMp4?: string | null;
		poster?: string | null;
		class?: string;
		controlClass?: string;
		observe?: Element | null;
	};

	let {
		mp4,
		webm,
		mobileMp4,
		poster,
		class: passedClasses = '',
		controlClass = 'bottom-4 right-4',
		observe = null
	}: Props = $props();

	let video = $state<HTMLVideoElement>();
	let playing = $state(false);
	let mounted = $state(false);
	let motionOk = true;
	let userPaused = false;

	const hasSource = $derived(Boolean(mp4 || webm || mobileMp4));

	function play() {
		try {
			video?.play()?.catch?.(() => {});
		} catch {
			return;
		}
	}

	function pause() {
		video?.pause();
	}

	onMount(() => {
		mounted = true;
		const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)');
		motionOk = !reduce?.matches;
		const onChange = (event: MediaQueryListEvent) => {
			motionOk = !event.matches;
			if (event.matches) pause();
		};
		reduce?.addEventListener?.('change', onChange);
		return () => reduce?.removeEventListener?.('change', onChange);
	});

	$effect(() => {
		const el = video;
		const target = observe ?? el;
		if (!el || !target) return;
		if (typeof IntersectionObserver === 'undefined') {
			if (motionOk) play();
			return;
		}
		const io = new IntersectionObserver(
			(entries) => {
				if (entries.some((e) => e.isIntersecting)) {
					if (motionOk && !userPaused) play();
				} else {
					pause();
				}
			},
			{ rootMargin: '200px 0px' }
		);
		io.observe(target);
		return () => io.disconnect();
	});

	function toggle() {
		if (playing) {
			userPaused = true;
			pause();
		} else {
			userPaused = false;
			play();
		}
	}
</script>

<video
	bind:this={video}
	class="bg-cover bg-center object-cover {passedClasses}"
	style={poster ? `background-image: url("${poster}")` : undefined}
	poster={poster ?? undefined}
	muted
	loop
	playsinline
	preload="metadata"
	aria-hidden="true"
	tabindex="-1"
	onplay={() => (playing = true)}
	onpause={() => (playing = false)}
>
	{#if mobileMp4}<source src={mobileMp4} type="video/mp4" media="(max-width: 767px)" />{/if}
	{#if webm}<source src={webm} type="video/webm" />{/if}
	{#if mp4}<source src={mp4} type="video/mp4" />{/if}
</video>
{#if mounted && hasSource}
	<button
		type="button"
		class="absolute z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white hover:bg-erp-blue {controlClass}"
		aria-label={playing ? 'Pause background video' : 'Play background video'}
		onclick={toggle}
	>
		{#if playing}
			<Pause size={18} aria-hidden="true" class="pointer-events-none" />
		{:else}
			<Play size={18} aria-hidden="true" class="pointer-events-none" />
		{/if}
	</button>
{/if}
