<script lang='ts'>
    import ContentWidth from "$lib/components/ContentWidth.svelte";
    import DefaultButton from "$lib/components/Buttons/DefaultButton.svelte";
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
    import { faBars, faClose} from "@fortawesome/free-solid-svg-icons";
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
        color:black;
leading-trim: both;
text-edge: cap;
font-feature-settings: 'clig' off, 'liga' off;

/* Button - all caps */

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
<div class="w-screen h-screen fixed bg-dark flex flex-col items-center justify-center gap-12 z-30" transition:fly>
    {#each navLinks as item}
        <a href={item.href} class="nav-link">{item.label}</a>
    {/each}

    <button class="absolute top-5 right-5 opacity-60 hover:opacity-100 transition-all z-40" on:click={toggleOverlayOff}>
        <div in:fade={{delay: 600}} out:fade class="text-white">
        <FontAwesomeIcon icon={faClose} size="3x" />
        </div>
      
    </button>
</div>
{/if}

<div class="h-16 w-screen z-40 fixed">
    <ContentWidth class="flex flex-row justify-between items-center h-full">
        <a href="/" class="hover:opacity-80 transition-all duration-500 bump">
            <img src={logoFull} alt="logo" class="h-12 md:h-32 translate-y-1/2" />
        </a>
        
        
        <div class="flex flex-row">
            <div class="hidden lg:flex flex-row justify-between items-center gap-10">
                {#each navLinks as item}
                    <a href={item.href} class="nav-link">{item.label}</a>
                {/each}
            </div>
       
        <button class="lg:hidden ml-6 opacity-60 hover:opacity-100 transition-all" on:click={toggleOverlayOn}>
           {#if !isOverlayVisible}
            <FontAwesomeIcon icon={faBars} size="2x"/>
            {/if}
        
        </button>
        </div>

    </ContentWidth>
</div>
