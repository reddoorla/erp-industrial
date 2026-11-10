<script lang="ts">
	// The contact page's own footer (the operator, 2026-11-10). The shared Footer is a sticky band
	// that sits over the last slide; on /contact that band covered the form, which had to scroll
	// inside a fixed section to get out from under it, and its logo repeated the nav's at the same
	// size. This one sits in the page's flow after the form, at any width, with no logo, and lists
	// Home with the site's sections. It drops the Contact button, which here would link to itself.
	import ContentWidth from './ContentWidth.svelte';
	import SocialLinks from './SocialLinks.svelte';
	import { portalLinks, siteLinks } from '$lib/site-links';

	const links = [{ href: '/', text: 'Home' }, ...siteLinks];
</script>

<footer class="bg-black w-screen snap-end text-white">
	<ContentWidth
		class="flex flex-col md:flex-row md:justify-between gap-8 py-12 md:py-8 md:whitespace-nowrap"
	>
		<div class="grid grid-cols-2 gap-x-6 md:flex md:flex-row md:gap-12 lg:gap-20">
			<nav aria-label="Site" class="flex flex-col md:gap-1">
				{#each links as link (link.href)}
					<a href={link.href} class="footer-link py-3! md:py-1!">{link.text}</a>
				{/each}
			</nav>
			<nav aria-label="Portals" class="flex flex-col md:gap-1">
				{#each portalLinks as link (link.href)}
					<a href={link.href} class="footer-link py-3! md:py-1!">{link.text}</a>
				{/each}
			</nav>
		</div>
		<div class="shrink-0 md:self-start">
			<SocialLinks />
		</div>
	</ContentWidth>
</footer>
