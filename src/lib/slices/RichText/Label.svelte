<!--
	Rich-text `label` serializer. @prismicio/svelte 2 passes each `components`
	entry the node plus a `children` snippet, so this is a runes component that
	renders `children`. (The 1.x legacy `export let` + `<slot>` version would
	still render and type-check under 2.x through Svelte 5's slot interop; this
	is the native form, not a forced fix.)
-->
<script lang="ts">
	import type { RTLabelNode } from '@prismicio/client';
	import type { RichTextComponentProps } from '@prismicio/svelte';

	let { node, children }: RichTextComponentProps<RTLabelNode> = $props();
</script>

{#if node.data.label === 'codespan'}
	<code>{@render children()}</code>
{:else}
	<span class={node.data.label}>{@render children()}</span>
{/if}
