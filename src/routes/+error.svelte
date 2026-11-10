<script lang="ts">
	// The site's not-found (and any other error) page. It is the root error page, so a missing
	// Prismic page (/[uid] throws 404) and a path no route matches (/a/b/c) both land here, served
	// by the Netlify function with the real status. Laid out as the contact page: black, the nav
	// light, a label, the site's h1 and paragraph type, and its outlined buttons; the footer as on
	// every other page. No Prismic call: an unknown URL should not cost one.
	import { page } from '$app/state';
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import ContentWidth from '$lib/components/ContentWidth.svelte';
	import DefaultButton from '$lib/components/Buttons/DefaultButton.svelte';
	import { slideObserver } from '$lib/actions/slideObserver';
	import { siteLinks } from '$lib/site-links';

	const navLinks = [...siteLinks, { href: '/contact', text: 'Contact' }];
	const notFound = $derived(page.status === 404);
</script>

<svelte:head>
	<meta name="robots" content="noindex" />
</svelte:head>

<Nav {navLinks} isLogoLarge={false} />

<!-- On md+ the section and the footer band share one screen (--footer-h, app.css), as the
     homepage's last slide does; below md the footer is a screen of its own, as everywhere. -->
<section
	class="w-screen h-dvh md:h-[calc(100dvh-var(--footer-h))] snap-start bg-black text-white overflow-hidden"
	use:slideObserver={{ navLight: true }}
>
	<ContentWidth class="h-full flex flex-col justify-center pt-24 pb-12 md:pt-40 md:pb-10">
		<h5 class="mb-7">{page.status}</h5>
		<h1 class="mb-7">{notFound ? 'Page not found' : 'Something went wrong'}</h1>
		<p class="mb-12 max-w-2xl">
			{#if notFound}
				The page you were looking for isn't here. It may have moved when we rebuilt the site.
				Everything we do is a click away below.
			{:else}
				This page didn't load. Please try again in a moment, or head back to the homepage.
			{/if}
		</p>
		<div class="flex flex-col sm:flex-row gap-0 sm:gap-5">
			<DefaultButton href="/" text="Home" filled={false} />
			<DefaultButton href="/portfolio" text="Industrial Portfolio" filled={false} />
			<DefaultButton href="/contact" text="Contact" filled={false} />
		</div>
	</ContentWidth>
</section>

<Footer />
