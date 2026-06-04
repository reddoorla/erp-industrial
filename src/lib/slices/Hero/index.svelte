<script lang="ts">
	let { slice }: { slice: HeroSlice } = $props();
	import { onMount } from 'svelte';
	import { fade } from '$lib/transitions';
	import { PrismicImage } from '@prismicio/svelte';
	import ContentWidth from '$lib/components/ContentWidth.svelte';
	import ContentBox from '$lib/components/ContentBox.svelte';
	import type { HeroSlice } from '../../../prismicio-types';

	let viewportWidth = $state(0);
	let viewportHeight = $state(0);

	import DefaultButton from '$lib/components/Buttons/DefaultButton.svelte';
	import { isFilled } from '@prismicio/helpers';

	import Player from '@vimeo/player';

	let videoId = $state('');

	let activeOverlay = $state(false);

	if (slice.primary.video_embed.embed_url)
		videoId = slice.primary.video_embed?.embed_url.split('/').pop() || '';

	let isMounted = $state(false);

	// Background Vimeo embeds start at a low adaptive-bitrate rendition (grainy) and ramp up over
	// the first few seconds. We keep the poster image over the iframe until the high rendition has
	// actually buffered, so the user never sees the grain. 6s hard cap so the poster never sticks.
	let videoIframe = $state<HTMLIFrameElement>();
	let videoReady = $state(false);

	// Returns a teardown that destroys the Vimeo Player + clears timers, so SPA navigation away
	// from the home page (which unmounts Hero) doesn't leak SDK instances/listeners/timers.
	function setupVideoReveal(): () => void {
		if (!videoIframe) return () => {};

		let revealed = false;
		const reveal = () => {
			if (revealed) return;
			revealed = true;
			videoReady = true;
		};

		const hardCap = setTimeout(reveal, 6000);
		let onReadyTimer: ReturnType<typeof setTimeout> | undefined;
		let player: Player | undefined;

		try {
			player = new Player(videoIframe);
			// Force a high rendition so the first frames aren't the grainy ramp-up.
			player
				.setQuality('1080p')
				.then(() => {
					// Quality accepted — reveal once the new rendition has buffered, or shortly after.
					const onReady = () => {
						clearTimeout(hardCap);
						reveal();
					};
					player?.on('bufferend', onReady);
					onReadyTimer = setTimeout(onReady, 1200);
				})
				.catch(() => {
					/* some background embeds refuse setQuality — the 6s hard cap still reveals */
				});
		} catch {
			/* SDK failed to init — the 6s hard cap still reveals */
		}

		return () => {
			clearTimeout(hardCap);
			if (onReadyTimer) clearTimeout(onReadyTimer);
			player?.destroy().catch(() => {});
		};
	}

	// const sendToBottomPane = () =>{
	// 	if(bottomPane?.getBoundingClientRect().top>10){
	// 		bottomPane.parentElement?.scrollTo(0, viewportHeight*2)
	// 	}
	// }

	onMount(() => {
		const mountTimer = setTimeout(() => (isMounted = true), 25);
		const teardownVideo = setupVideoReveal();
		return () => {
			clearTimeout(mountTimer);
			teardownVideo();
			if (moveRaf) cancelAnimationFrame(moveRaf);
		};
	});

	let hoveredElements: Set<HTMLElement> = new Set();
	let moveRaf = 0;
	let pendingMove: { x: number; y: number; target: HTMLElement } | null = null;

	// rAF-throttled: the elementsFromPoint hover-tint now runs at most once per frame instead of on
	// every single mousemove (the original was a hot path, especially over the playing Vimeo iframe).
	const handleMouseMove = (event: MouseEvent) => {
		pendingMove = {
			x: event.clientX,
			y: event.clientY,
			target: event.currentTarget as HTMLElement
		};
		if (moveRaf) return;
		moveRaf = requestAnimationFrame(() => {
			moveRaf = 0;
			if (pendingMove) processHover(pendingMove.x, pendingMove.y, pendingMove.target);
		});
	};

	const processHover = (x: number, y: number, currentTarget: HTMLElement) => {
		const elementsUnder = document.elementsFromPoint(x, y);
		const currentHoveredElements: Set<HTMLElement> = new Set(
			elementsUnder.filter((element) => element !== currentTarget) as HTMLElement[]
		);

		// Dispatch mouseout event for elements no longer hovered
		hoveredElements.forEach((element) => {
			if (!currentHoveredElements.has(element)) {
				if (
					element.tagName === 'A' ||
					(element.tagName === 'BUTTON' && !element.classList.contains('nav-link'))
				) {
					element.classList.remove('bg-erp-blue');
					element.classList.add('bg-black');
					document.getElementsByTagName('body')[0].style.cursor = 'auto';
				}
			}
		});

		// Dispatch mouseover event for newly hovered elements
		currentHoveredElements.forEach((element) => {
			if (!hoveredElements.has(element)) {
				if (
					element.tagName === 'A' ||
					(element.tagName === 'BUTTON' && !element.classList.contains('nav-link'))
				) {
					element.classList.remove('bg-black');
					element.classList.add('bg-erp-blue');
					document.getElementsByTagName('body')[0].style.cursor = 'pointer';
				}
			}
		});

		hoveredElements = currentHoveredElements;
	};

	const handleClick = (event: MouseEvent) => {
		// Manually propagate the click event to the elements underneath
		const elementsUnder = document.elementsFromPoint(event.clientX, event.clientY);
		elementsUnder.forEach((element: Element) => {
			if (element !== event.currentTarget) {
				(element as HTMLElement).click();
			}
		});
	};
</script>

<svelte:window bind:innerHeight={viewportHeight} bind:innerWidth={viewportWidth} />

{#if activeOverlay}
	<div
		class="w-screen h-dvh top-0 left-0 fixed z-40 bg-black bg-opacity-50 backdrop-blur-sm"
		in:fade={{ delay: 300 }}
		out:fade
	>
		<ContentWidth
			class="h-full flex justify-center items-center overflow-y-auto md:overflow-hidden py-32 md:pb-8"
		>
			<i
				class="absolute left-1/2 right-1/2 fa fa-spin fa-circle-o-notch fa-xl -translate-x-full -translate-y-full scale-[200%] text-white w-6 leading-6"
			></i>

			{#if viewportWidth > 1024}
				<iframe
					title="background video"
					src="https://player.vimeo.com/video/939250244?background=1&muted=0&autoplay=1"
					class="object-cover aspect-video w-full md:w-4/5 mx-auto z-10"
					frameborder="0"
					allow="autoplay"
				></iframe>
			{:else}
				<iframe
					title="background video"
					src="https://player.vimeo.com/video/939250244"
					class="object-cover aspect-video w-full md:w-4/5 mx-auto z-10"
					frameborder="0"
				></iframe>
			{/if}

			<DefaultButton
				text="Close"
				class="absolute bottom-4 mx-[4%] md:mx-auto max-w-[92%]"
				onclick={() => (activeOverlay = false)}
			/>
		</ContentWidth>
	</div>
{/if}

{#key slice}
	<div
		class="w-screen h-dvh overflow-hidden snap-end fixed top-0"
		in:fade={{ delay: 400 }}
		out:fade
	>
		<PrismicImage
			field={slice.primary.loading_placeholder}
			loading="eager"
			fetchpriority="high"
			imgixParams={{ auto: ['format', 'compress'] }}
			class="object-cover absolute aspect-video z-10 transition-opacity duration-700 {videoReady
				? 'opacity-0 pointer-events-none'
				: 'opacity-100'} {viewportHeight * 16 > viewportWidth * 9
				? 'h-full min-w-full'
				: 'w-full min-h-full'}"
		/>
		{#if videoId && isFilled.embed(slice.primary.video_embed)}
			<iframe
				bind:this={videoIframe}
				title="background video"
				src={`https://player.vimeo.com/video/${videoId}?background=1&autoplay=1&loop=1&autopause=0`}
				class="object-cover absolute aspect-video {viewportHeight * 16 > viewportWidth * 9
					? 'h-dvh min-w-full'
					: 'w-screen min-h-full'}"
				frameborder="0"
				allowfullscreen
			></iframe>
		{:else}
			<div
				transition:fade
				class="w-full h-full absolute top-0 left-0"
				style="background: linear-gradient(180deg, rgba(0, 0, 0, 0.00) 14.68%, rgba(0, 0, 0, 0.50) 69.9%)"
			></div>
		{/if}

		<ContentWidth class="h-full relative justify-end z-30">
			<div
				class="md:w-11/12 max-w-(--breakpoint-lg) relative h-full flex flex-col justify-end overflow-hidden py-32 sm:py-16 lg:py-32"
			>
				{#if isMounted}
					<div transition:fade>
						<ContentBox
							titleText={slice.primary.title || ''}
							titleTag="h1"
							paragraphText={slice.primary.body_text || ''}
							float="left"
							class="text-white z-20 text-left"
						/>
						{#if slice.primary.button_text}
							<DefaultButton
								text={slice.primary.button_text || ''}
								href={isFilled.link(slice.primary.button_link) ? slice.primary.button_link.url : ''}
							/>
						{/if}
						{#if slice.primary.title === 'Who We Are'}
							<DefaultButton text="Watch" onclick={() => (activeOverlay = true)} />
						{/if}
					</div>
				{/if}
			</div>
		</ContentWidth>
	</div>
	<div
		class="w-screen h-dvh sticky snap-end overflow-hidden"
		onclick={handleClick}
		onmousemove={handleMouseMove}
		aria-hidden="true"
	>
		<i
			class="fa-sharp fa-regular fa-arrow-up rotate-180 text-white opacity-40 fa-xl absolute bottom-32 md:bottom-8 right-8"
		></i>
	</div>
{/key}
