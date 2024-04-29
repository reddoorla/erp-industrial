<script lang="ts">
	import ContentWidth from "./ContentWidth.svelte";
    import logoFull from "../assets/fullLogo.png"
    import loopnet from "../assets/icons/loopnet.svg"
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
    import { faFacebookF, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
	import DefaultButton from "./Buttons/DefaultButton.svelte";
	import { text } from "@sveltejs/kit";

    let viewportWidth:number;
    


</script>

<style>
    .footer-link{
        color: var(--ffffff, #FFF);
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

<svelte:window bind:innerWidth={viewportWidth} />

<div class="bg-black w-screen sticky snap-end h-screen top-0 md:h-[30vh] md:top-[70vh]">
    <ContentWidth class="flex flex-row pt-6 h-full">
        {#if viewportWidth>768}
        <div class="h-full w-1/3 relative">
            <a href="/" class="w-[25%] hover:opacity-80 transition-all duration-500 bump brightness-0 invert relative block">
                <img src={logoFull} alt="logo" class="w-full" />
            </a>
        </div>
        <div class="h-full w-1/6 flex flex-col gap-4">
            <a href="/about" class="footer-link">ABOUT</a>
            <a href="/portfolio" class="footer-link">INDUSTRIAL PORTFOLIO</a>
            <a href="/investors" class="footer-link">INVESTORS</a>
            <a href="/office" class="footer-link">OFFICE</a>
        </div>
        <div class="h-full w-1/6 flex flex-col gap-4">
            <a href="/" class="footer-link">PE INVESTOR PORTAL</a>
            <a href="/" class="footer-link">DST INVESTOR PORTAL</a>
            <a href="/" class="footer-link">TENANT PORTAL</a>
        </div>
        <div class="h-full w-1/12"></div>
        <div class="h-full w-1/4 flex flex-col gap-8">
            <div class="w-full flex flex-row h-6 gap-6 text-subtle-blue">
                <a href="https://linkedin.com" class="text-xl"><FontAwesomeIcon icon={faLinkedinIn}/></a>
                <a href="https://linkedin.com" class="text-lg -translate-y-[2px]"><FontAwesomeIcon icon={faFacebookF}/></a>
                <a href="https://linkedin.com" class="scale-105"><img src={loopnet} alt="loopnet"/></a>
            </div>
            <a href="/contact">
                <DefaultButton text="Contact" filled={false} class="text-white border-2 border-white"/>
            </a>
        </div>
        {:else}
            <div class="w-full h-full flex flex-col gap-8">
                <a href="/" class="h-12 hover:opacity-80 transition-all duration-500 bump brightness-0 invert relative block translate-y-2">
                    <img src={logoFull} alt="logo" class="h-12" />
                </a>
                <a href="/about" class="footer-link">ABOUT</a>
                <a href="/portfolio" class="footer-link">INDUSTRIAL PORTFOLIO</a>
                <a href="/investors" class="footer-link">INVESTORS</a>
                <a href="/" class="footer-link">PE INVESTOR PORTAL</a>
                <a href="/" class="footer-link">DST INVESTOR PORTAL</a>
                <a href="/" class="footer-link">TENANT PORTAL</a>
                <div class="w-full flex flex-row h-6 gap-6 text-subtle-blue">
                    <a href="https://linkedin.com" class="text-xl"><FontAwesomeIcon icon={faLinkedinIn}/></a>
                    <a href="https://linkedin.com" class="text-lg -translate-y-[2px]"><FontAwesomeIcon icon={faFacebookF}/></a>
                    <a href="https://linkedin.com" class="scale-105"><img src={loopnet} alt="loopnet"/></a>
                </div>
                <a href="/contact">
                    <DefaultButton text="Contact" filled={false} class="text-white border-2 border-white"/>
                </a>
            </div>
        {/if}

    </ContentWidth>
</div>