<script lang='ts'>
    import ContentWidth from "$lib/components/ContentWidth.svelte";

    import logoFull from "$lib/assets/erp_logo_subtitled.svg"

    import { isNavLight } from "$lib/stores/isNavLight";


    import { fly, fade } from "svelte/transition"
	import { onMount } from "svelte";

    export let navLinks=[
        {
            text:"ABOUT",
            href:"/about"
        },
        {
            text:"INDUSTRIAL PORTFOLIO",
            href:"/portfolio"
        },
        {
            text:"INVESTORS",
            href:"/investors"
        },
        {
            text:"OFFICE",
            href:"/office"
        },
        {
            text:"CONTACT",
            href:"/contact"
        },

    ];

    export let isLogoLarge=true;


    let activeSlice = 0;


    let isOverlayVisible = false;

    const toggleOverlayOn = () => isOverlayVisible = true;
    const toggleOverlayOff = () => isOverlayVisible = false;

    let viewportWidth:number;


</script>


<style>
    .nav-link{
font-size: 11px;
font-style: normal;
font-weight: 500;
line-height: 145%; 
letter-spacing: 2px;
text-transform: uppercase;
    }


</style>

<svelte:window bind:innerWidth={viewportWidth} />


<!--overlay-->
{#if isOverlayVisible}
<div class="w-screen h-screen fixed bg-dark z-30" transition:fly>
 

    <ContentWidth class="h-screen relative flex flex-col items-center justify-center gap-12">
        <button class="absolute top-5 right-0 opacity-60 hover:opacity-100 transition-all z-50 text-white pointer-events-auto" on:click={toggleOverlayOff}>
            <i class="fa-sharp fa-regular fa-xmark text-2xl text-white" in:fade={{delay: 600}} out:fade></i>
        </button>

        {#each navLinks as item}
            <a href={item.href} class="nav-link text-white pointer-events-auto" on:click={toggleOverlayOff}>{item.text}</a>
        {/each}
    </ContentWidth>
</div>
{/if}

<div class="h-16 w-screen z-40 fixed pointer-events-none transition-color duration-700 ease-fast-slow {$isNavLight ? "text-white":""}">
    <ContentWidth class="flex flex-row justify-between items-center h-full">
        <a href="/" class="hover:opacity-100 transition-all duration-500 bump pointer-events-auto">
            <img src={logoFull} alt="logo" class="h-12 md:h-32 transition-all duration-700 ease-fast-slow hover:opacity-100 {$isNavLight ? "brightness-0 invert" : ""} {(isLogoLarge ? "scale-[200%] translate-y-full  translate-x-1/2":"translate-y-1/2")}" style="clip-path: {isLogoLarge ? 'inset(0)' : 'inset(0 0 10px 0)'};"/>          
        </a>
        
        
        <div class="flex flex-row">
            <div class="hidden lg:flex flex-row justify-between items-center gap-10">
                {#each navLinks as item}
                    <a href={item.href} class="nav-link pointer-events-auto">{item.text}</a>
                {/each}
            </div>
    {#if !isOverlayVisible}
        <button class="lg:hidden ml-6 opacity-60 hover:opacity-100 transition-all pointer-events-auto text-2xl z-40" in:fade={{delay: 600}} out:fade on:click={toggleOverlayOn}>
          
            <i class="fa-sharp fa-regular fa-bars h-8"></i>
     
        </button>
        {/if}
        </div>

    </ContentWidth>
</div>
