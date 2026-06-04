<!--
	Intentionally a legacy (non-runes) component: @prismicio/svelte's `components`
	map is typed for legacy `SvelteComponent` classes, so this serializer must stay
	`export let` + `<slot>` to satisfy that type. `<slot>` is not deprecated in
	legacy mode, and this is a stateless render leaf — no reactivity hazard.
-->
<script>
	/** @type {import("@prismicio/client").RTLabelNode} */
	export let node;
</script>

{#if node.data.label === 'codespan'}
	<code><slot /></code>
{:else}
	<span class={node.data.label}><slot /></span>
{/if}
