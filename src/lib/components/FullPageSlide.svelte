<script lang="ts">
	import type { ImageFieldImage } from "@prismicio/client";
	import { PrismicImage } from "@prismicio/svelte";

    export let backgroundImage:ImageFieldImage|null = null;

    let viewportWidth:number;
    let viewportHeight:number;
    

</script>

<svelte:window bind:innerHeight={viewportHeight} bind:innerWidth={viewportWidth} />

<div class="w-screen h-screen overflow-hidden">
    {#if backgroundImage}
        <PrismicImage field={backgroundImage} class="object-cover absolute {viewportHeight*16 >viewportWidth*9 ? "h-full":"w-full"}"/>
        <div class="w-full h-full absolute top-0 left-0" style="background: linear-gradient(180deg, rgba(0, 0, 0, 0.00) 14.68%, rgba(0, 0, 0, 0.50) 69.9%)"></div>
    {/if}

    <slot />

</div>