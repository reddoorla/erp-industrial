<script>
	let { node } = $props();
	/** @type {import("@prismicio/client").RTLabelNode} */
</script>

{#if node.data.label === 'codespan'}
	<code><slot /></code>
{:else}
	<span class={node.data.label}><slot /></span>
{/if}
