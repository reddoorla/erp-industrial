<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import { withBuildOut } from '$lib/buildout';
	import { onMount } from 'svelte';

	onMount(() =>
		withBuildOut((BuildOut) =>
			BuildOut.embed({
				token: 'bdecc802689ae7f3e2007fdaf2ffdb31f711a99e',
				plugin: 'inventory',
				target: 'buildout'
			})
		)
	);
</script>

<svelte:head>
	<title>ERP Properties</title>
</svelte:head>

<div class="w-screen h-dvh bg-white fixed top-0">
	<Nav isLogoLarge={false} />
	<div class="mt-[20dvh]">
		<div id="buildout" style="max-width:1440px; margin:auto; height:80dvh;"></div>
	</div>
</div>
