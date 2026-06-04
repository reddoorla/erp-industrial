<script lang="ts">
	import type { Snippet } from 'svelte';

	let { class: className = '', children }: { class?: string; children?: Snippet } = $props();
</script>

<div
	class="max-w-[1220px] xl:mx-auto mx-[4%] {className ||
		'flex flex-col items-center justify-center my-16 relative'}"
>
	{@render children?.()}
</div>
