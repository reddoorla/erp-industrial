<script lang='ts'>
    import ContentWidth from "$lib/components/ContentWidth.svelte";
    import DefaultButton from "$lib/components/Buttons/DefaultButton.svelte";
    import logoFull from "$lib/assets/fullLogo.png"

    import { fly, fade } from "svelte/transition"

    export let navLinks=[
        {
            label:"ABOUT",
            href:"/"
        },
        {
            label:"PORTFOLIO",
            href:"/"
        },
        {
            label:"RESOURCES",
            href:"/"
        },
        {
            label:"BLOG",
            href:"/"
        },
        {
            label:"CONTACT",
            href:"/"
        },

    ];



    let isOverlayVisible = false;

    const toggleOverlayOn = () => isOverlayVisible = true;
    const toggleOverlayOff = () => isOverlayVisible = false;
</script>


<style>
    .nav-link{
font-size: 8px;
font-style: normal;
font-weight: 500;
line-height: 145%; /* 11.6px */
letter-spacing: 2px;
text-transform: uppercase;
    }

    a{
        transition: opacity 400ms ease;
    }
    a:hover{
        opacity:0.8;
    }
</style>



<!--overlay-->
{#if isOverlayVisible}
<div class="w-screen h-screen fixed bg-dark z-30" transition:fly>
 

    <ContentWidth class="h-screen relative flex flex-col items-center justify-center gap-12">
        <button class="absolute top-5 right-0 opacity-60 hover:opacity-100 transition-all z-50 text-white" on:click={toggleOverlayOff}>
            <i class="fa-sharp fa-regular fa-xmark text-2xl text-white" in:fade={{delay: 600}} out:fade></i>
        </button>

        {#each navLinks as item}
            <a href={item.href} class="nav-link text-white pointer-events-auto">{item.label}</a>
        {/each}
    </ContentWidth>
</div>
{/if}

<div class="h-16 w-screen z-40 fixed pointer-events-none">
    <ContentWidth class="flex flex-row justify-between items-center h-full">
        <a href="/" class="hover:opacity-80 transition-all duration-500 bump">
            <img src={logoFull} alt="logo" class="h-12 md:h-32 translate-y-1/2" />
        </a>
        
        
        <div class="flex flex-row">
            <div class="hidden lg:flex flex-row justify-between items-center gap-10">
                {#each navLinks as item}
                    <a href={item.href} class="nav-link pointer-events-auto">{item.label}</a>
                {/each}
            </div>
    {#if !isOverlayVisible}
        <button class="lg:hidden ml-6 opacity-60 hover:opacity-100 transition-all pointer-events-auto text-2xl" in:fade={{delay: 600}} out:fade on:click={toggleOverlayOn}>
          
            <i class="fa-sharp fa-regular fa-bars h-8"></i>
     
        
        </button>
        {/if}
        </div>

    </ContentWidth>
</div>
