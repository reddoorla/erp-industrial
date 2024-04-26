<script>
	import { SliceZone } from '@prismicio/svelte';


	import { components } from '$lib/slices';

	export let data;
</script>

<svelte:head>
    <title>ERP Industrial</title>
</svelte:head>

<SliceZone slices={data.page.data.slices} {components} />
