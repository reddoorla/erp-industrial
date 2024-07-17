<script lang="ts">
	import type { ImageFieldImage } from "@prismicio/client";
	import { PrismicImage } from "@prismicio/svelte";

    export let backgroundImage:ImageFieldImage|null = null;

    let viewportWidth:number;
    let viewportHeight:number;
    

</script>

<svelte:window bind:innerHeight={viewportHeight} bind:innerWidth={viewportWidth} />

<div class="w-screen h-screen overflow-hidden relative">
    {#if backgroundImage}
        <PrismicImage field={backgroundImage} class="object-cover absolute w-screen h-screen left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"/>
        <div class="w-full h-full absolute top-0 left-0" style="background: linear-gradient(180deg, rgba(0, 0, 0, 0.00) 14.68%, rgba(0, 0, 0, 0.50) 69.9%)"></div>
            <i class="fa-sharp fa-regular fa-arrow-up rotate-180 text-white opacity-40 fa-xl absolute bottom-32 md:bottom-8 right-8" />
    {/if}

    <slot />

</div>