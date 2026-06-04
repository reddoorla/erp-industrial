<script lang="ts">
	import ContentWidth from '$lib/components/ContentWidth.svelte';
	import logoFull from '$lib/assets/erp_logo_subtitled.svg';
	import { isNavLight } from '$lib/stores/isNavLight';
	import { fly, fade } from '$lib/transitions';

	let {
		navLinks = [] as { text: string; href: string }[],
		isLogoLarge = $bindable(true)
	}: { navLinks?: { text: string; href: string }[]; isLogoLarge?: boolean } = $props();

	let isOverlayVisible = $state(false);
	let overlayEl = $state<HTMLElement>();
	let openButtonEl = $state<HTMLElement>();

	const toggleOverlayOn = () => (isOverlayVisible = true);
	const toggleOverlayOff = () => (isOverlayVisible = false);

	let viewportWidth = $state(0);

	// When the mobile menu is open: move focus into it, trap Tab, and close on Escape — so keyboard
	// users can't tab "behind" the overlay. Focus returns to the trigger on close.
	$effect(() => {
		if (!isOverlayVisible || !overlayEl) return;
		const node = overlayEl;
		const previouslyFocused = document.activeElement as HTMLElement | null;
		const getFocusable = () =>
			Array.from(node.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'));
		getFocusable()[0]?.focus();

		const onKeydown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				toggleOverlayOff();
				return;
			}
			if (e.key !== 'Tab') return;
			const items = getFocusable();
			if (!items.length) return;
			const first = items[0];
			const last = items[items.length - 1];
			if (e.shiftKey && document.activeElement === first) {
				e.preventDefault();
				last.focus();
			} else if (!e.shiftKey && document.activeElement === last) {
				e.preventDefault();
				first.focus();
			}
		};
		document.addEventListener('keydown', onKeydown);
		return () => {
			document.removeEventListener('keydown', onKeydown);
			// The open trigger unmounts while the overlay is open, so the captured node is detached by
			// close. Focus the re-rendered trigger after it remounts (fall back to the prior element).
			requestAnimationFrame(() => {
				if (openButtonEl) openButtonEl.focus();
				else if (previouslyFocused?.isConnected) previouslyFocused.focus?.();
			});
		};
	});
</script>

<svelte:window bind:innerWidth={viewportWidth} />

<!--overlay-->
{#if isOverlayVisible}
	<div bind:this={overlayEl} class="w-screen h-dvh fixed bg-dark z-30" transition:fly>
		<ContentWidth class="h-dvh relative flex flex-col items-center justify-center gap-12">
			<button
				class="absolute top-3 right-0 flex items-center justify-center min-h-11 min-w-11 opacity-60 hover:opacity-100 transition-all z-50 text-white pointer-events-auto"
				onclick={toggleOverlayOff}
				aria-label="Close menu"
			>
				<i
					class="fa-sharp fa-regular fa-xmark text-2xl text-white"
					in:fade={{ delay: 600 }}
					out:fade
				></i>
			</button>

			{#each navLinks as item (item.href)}
				<a
					href={item.href}
					class="nav-link text-white pointer-events-auto py-3 px-4"
					onclick={toggleOverlayOff}>{item.text}</a
				>
			{/each}
		</ContentWidth>
	</div>
{/if}

<div
	class="h-16 w-screen z-40 fixed pointer-events-none transition-color duration-700 ease-fast-slow {$isNavLight
		? 'text-white'
		: ''}"
>
	<ContentWidth class="flex flex-row justify-between items-center h-full">
		<a href="/" class="hover:opacity-100 transition-all duration-500 bump pointer-events-auto">
			<img
				src={logoFull}
				alt="ERP Industrials"
				class="h-12 md:h-32 transition-all duration-700 ease-fast-slow hover:opacity-100 {$isNavLight
					? 'brightness-0 invert'
					: ''} {isLogoLarge
					? 'scale-[200%] translate-y-full  translate-x-1/2'
					: 'translate-y-1/2'}"
				style="clip-path: {isLogoLarge ? 'inset(0)' : 'inset(0 0 10px 0)'};"
			/>
		</a>

		<div class="flex flex-row">
			<div class="hidden lg:flex flex-row justify-between items-center gap-10">
				{#each navLinks as item (item.href)}
					<a href={item.href} class="nav-link pointer-events-auto">{item.text}</a>
				{/each}
			</div>
			{#if !isOverlayVisible}
				<button
					bind:this={openButtonEl}
					class="lg:hidden -mr-2 flex items-center justify-center min-h-11 min-w-11 opacity-60 hover:opacity-100 transition-all pointer-events-auto text-2xl z-40"
					in:fade={{ delay: 600 }}
					out:fade
					onclick={toggleOverlayOn}
					aria-label="Open menu"
				>
					<i class="fa-sharp fa-regular fa-bars"></i>
				</button>
			{/if}
		</div>
	</ContentWidth>
</div>

<style>
	.nav-link {
		font-size: 11px;
		font-style: normal;
		font-weight: 500;
		line-height: 145%;
		letter-spacing: 2px;
		text-transform: uppercase;
	}
</style>
