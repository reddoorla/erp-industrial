<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import * as prismicHelpers from '@prismicio/helpers';
	import ContentWidth from '$lib/components/ContentWidth.svelte';
	import { onMount } from 'svelte';

	export let data;

	let navLinks = [{ href: '', text: '' }];
	let isLogoLarge = false;

	data.nav.data.links.forEach((link) => {
		navLinks.push({
			href: prismicHelpers.isFilled.link(link.href) ? link.href.url || '#' : '#',
			text: link.text || ''
		});
	});

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

<Nav {navLinks} bind:isLogoLarge />

<section class="h-screen w-screen absolute">
	<ContentWidth class="flex flex-row items-center justify-center mt-48">
		<div class="w-1/3 flex flex-col gap-4">
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
		<form class="w-2/3 flex flex-col gap-8 pl-16" name="contact" method="POST" action="/contact">
			<h5 class="text-white">SEND US A MESSAGE</h5>
			<div class="w-full flex flex-row justify-between">
				<input type="email" name="email" placeholder="Your Email" class="w-[45%]" />
				<select name="interest" class="w-[45%] cursor-pointer" placeholder="Select Interest">
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
				SUBMIT
			</button>
		</form>
	</ContentWidth>
</section>
