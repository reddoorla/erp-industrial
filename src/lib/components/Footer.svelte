<script lang="ts">
	import ContentWidth from './ContentWidth.svelte';
	import logoFull from '../assets/fullLogo.webp';
	import DefaultButton from './Buttons/DefaultButton.svelte';
	import { portalLinks, siteLinks } from '$lib/site-links';
	import SocialLinks from './SocialLinks.svelte';
</script>

<!-- Desktop and phone layouts are both in the markup and switched by CSS at md. They used to be
     switched on a bound innerWidth, which is 0 during SSR, so every desktop visit got the phone
     footer from the server and swapped it for the desktop one on hydration.

     On md+ the footer is a band of --footer-h (app.css) at the bottom of the last screen; the embed
     slide sizes itself against the same variable so the two fill that screen exactly. Below md it is
     a screen of its own that paints over the fixed nav (both z-40, the footer later), carrying every
     nav link itself. -->
<footer
	class="bg-black w-screen sticky snap-end h-dvh top-0 md:h-(--footer-h) md:top-[calc(100dvh-var(--footer-h))] z-40"
>
	<ContentWidth
		class="hidden md:flex flex-row justify-between gap-8 h-full py-6 text-white whitespace-nowrap"
	>
		<a
			href="/"
			class="w-24 lg:w-32 shrink-0 self-start hover:opacity-80 transition-all duration-500 bump brightness-0 invert block"
		>
			<img src={logoFull} alt="ERP Industrials" class="w-full" />
		</a>
		<div class="flex flex-row gap-12 lg:gap-20">
			<nav aria-label="Site" class="flex flex-col gap-1">
				{#each siteLinks as link (link.href)}
					<a href={link.href} class="footer-link">{link.text}</a>
				{/each}
			</nav>
			<nav aria-label="Portals" class="flex flex-col gap-1">
				{#each portalLinks as link (link.href)}
					<a href={link.href} class="footer-link">{link.text}</a>
				{/each}
			</nav>
		</div>
		<div class="flex flex-col gap-4 shrink-0">
			<SocialLinks />
			<DefaultButton href="/contact" text="Contact" filled={false} />
		</div>
	</ContentWidth>

	<ContentWidth class="md:hidden flex flex-col justify-center gap-8 h-full pt-24 pb-12 text-white">
		<a
			href="/"
			class="w-28 hover:opacity-80 transition-all duration-500 bump brightness-0 invert block"
		>
			<img src={logoFull} alt="ERP Industrials" class="w-full" />
		</a>
		<div class="grid grid-cols-2 gap-x-6">
			<nav aria-label="Site" class="flex flex-col">
				{#each siteLinks as link (link.href)}
					<a href={link.href} class="footer-link py-3!">{link.text}</a>
				{/each}
			</nav>
			<nav aria-label="Portals" class="flex flex-col">
				{#each portalLinks as link (link.href)}
					<a href={link.href} class="footer-link py-3!">{link.text}</a>
				{/each}
			</nav>
		</div>
		<SocialLinks />
		<DefaultButton href="/contact" text="Contact" filled={false} />
	</ContentWidth>
</footer>
