<script lang="ts">
	import type { RichTextSlice } from '../../../prismicio-types';
	let { slice }: { slice: RichTextSlice } = $props();
	import { PrismicRichText } from '@prismicio/svelte';
	import Label from './Label.svelte';
</script>

<section class="container">
	<PrismicRichText
		field={slice.primary.content}
		components={{
			label: Label
		}}
	/>
</section>

<style>
	.container {
		max-width: 600px;
		margin: 6em auto;
		font-family:
			-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif,
			'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
	}
</style>
