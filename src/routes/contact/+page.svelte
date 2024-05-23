<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import * as prismicHelpers from '@prismicio/helpers';
	import ContentWidth from '$lib/components/ContentWidth.svelte';
    import { page } from '$app/stores';
	import { enhance } from '$app/forms';
    import type { ActionData, SubmitFunction } from './$types';
	import DefaultButton from '$lib/components/Buttons/DefaultButton.svelte';
	import { fade } from 'svelte/transition';

	export let data;
    interface FormData {
    success: boolean;
    // Add other properties if needed
  }

  let form: FormData | undefined;

  page.subscribe(($page) => {
    form = $page.form as FormData | undefined;
  });

	let navLinks = [{ href: '', text: '' }];

	data.nav.data.links.forEach((link) => {
		navLinks.push({
			href: prismicHelpers.isFilled.link(link.href) ? link.href.url || '#' : '#',
			text: link.text || ''
		});
	});

    let isEmailSent = false;
    let isEmailSending = false;
    let isEmailFailed = false;


  // ... (rest of the code remains the same)

  const handleSubmit: SubmitFunction = () => {
    isEmailSending = true;

    return async ({ result  }) => {
        console.log(result.type)
      if (result.type === 'success') {
        isEmailSent = true;
      } else if (result.type === 'failure') {
        isEmailFailed = true;
      }
      isEmailSending = false;
    };
  };

  import { afterNavigate, disableScrollHandling } from '$app/navigation';
	import { isNavLight } from '$lib/stores/isNavLight';
	import Footer from '$lib/components/Footer.svelte';
	import { onMount } from 'svelte';

afterNavigate(() => {
    disableScrollHandling();
	isNavLight.set(true);
    setTimeout(() => {
        scrollTo({ top: 0, behavior: 'instant' });
    }, 50);
});



onMount(()=>{
	isNavLight.set(true);
})

let viewportWidth:number;
</script>

<svelte:head>
	<title>ERP Industrial</title>
</svelte:head>

<style>
	input, select, textarea{
		border-radius: 4px;
		background: #1D1C1C;
		padding:12px;
	}
	input, textarea{
		color:white;
		resize: none;
	}
	input::placeholder, textarea::placeholder, select{
		color:#FFFFFF99;
	}



	button{

font-weight: 500;
line-height: 24px;
text-align: center;
border-radius: 3px;
display: flex;
padding: 10px;
justify-content: center;
align-items: center;
min-width: 160px;

}

@media only screen and (max-width:768px) {
button{
	font-style: normal;
	font-weight: 500;
	text-align: center;
	border-radius: 3px;
	padding: 10px;
}
}
</style>

<svelte:window bind:innerWidth={viewportWidth} />

<Nav {navLinks} isLogoLarge={false} />

<section class="h-screen w-screen snap-end fixed top-0 overflow-y-auto">
	<ContentWidth class="flex flex-col md:flex-row items-center justify-center mt-48">
		<div class="w-full md:w-1/3 flex flex-col gap-4">
			<h2 class="text-white mb-4">We'd Love to Hear from You</h2>
			<p class="text-white mb-12">
				Please send us a message so that we can know how to best serve you and your industrial real
				estate needs.
			</p>
			<div class="button-text text-white">VISIT</div>
			<p class="text-white mb-4 whitespace-pre-line">
				400 W. Illinois Avenue, Suite 1630 <br /> Midland, TX 79701
			</p>
			<div class="button-text text-white">CALL</div>
			<p class="text-white mb-4">432.242.8850</p>
			<div class="button-text text-white">MESSAGE</div>
			<p class="text-white">info@erpfunds.com</p>
		</div>
        <div class="w-full md:w-2/3 my-32 md:my-0 md:pl-16 relative">
        {#if !isEmailSent}
        {#if isEmailFailed}
        <div class='absolute flex flex-col items-center justify-center -top-24 right-0 border-[#b21c0e] border-2 bg-black' transition:fade>
            <h5 class='text-subtle-blue p-8'>Something went wrong. Please fill all fields and retry.</h5>
        </div>
            
        {/if}
		<form class="w-full flex flex-col gap-8" name="contact" method="POST" action="/contact" use:enhance={handleSubmit}>
			<h5 class="text-white">SEND US A MESSAGE</h5>
			<div class="w-full flex flex-col gap-8 md:gap-0 md:flex-row justify-between">
				<input type="email" name="email" placeholder="Your Email" class="md:w-[45%]" />
				<select name="interest" class="md:w-[45%] cursor-pointer" placeholder="Select Interest">
					<option class="text-gr">Select Interest</option>
					<option value="Leasing">Leasing</option>
					<option value="Investor Relations">Investor Relations</option>
					<option value="Leasing">Property Sales and Acquisition</option>
				</select>
			</div>
			<div class="w-full">
				<textarea name="message" class="w-full h-48" placeholder="Your Message" />
			</div>
			<button
				class="hover:bg-erp-blue border-white border-2 text-white active:bg-black w-full md:w-fit text-center mb-5 sm:mb-0 uppercase cursor-pointer text-nowrap transition-all duration-300 active:-translate-y-2"
				type="submit"
			>
				{#if !isEmailSending} 
                    Submit 
                {:else} 
                    <div><i class='fa fa-spin fa-circle-o-notch fa-2xl leading-4 w-4'></i></div>
                {/if}
			</button>
		</form>
        {/if}
        {#if isEmailSent}
        <div class="w-full h-72 flex flex-col items-center justify-center gap-16">
            <h5 class="text-white">THANK YOU!</h5>
            <p class="text-white">We'll get back to you as soon as possible. In the meantime, explore our available properties.</p>
            <DefaultButton text="AVAILABILITIES" href="/industrial-portfolio" filled={false}/>
        </div>
        {/if}
    </div>

	</ContentWidth>
</section>
{#if viewportWidth>768}
<Footer />
{/if}