<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';
	let { data, form }: { data: PageData; form: ActionData } = $props();
	import Nav from '$lib/components/Nav.svelte';
	import * as prismicHelpers from '@prismicio/helpers';
	import ContentWidth from '$lib/components/ContentWidth.svelte';
	import DefaultButton from '$lib/components/Buttons/DefaultButton.svelte';
	import { fade } from '$lib/transitions';

	import type { NavDocumentDataLinksItem } from '../../prismicio-types';
	const navLinks = $derived(
		data.nav.data.links.map((link: NavDocumentDataLinksItem) => ({
			href: prismicHelpers.isFilled.link(link.href) ? link.href.url || '#' : '#',
			text: link.text || ''
		}))
	);

	let submitting = $state(false);
	let thankYouHeading = $state<HTMLElement>();

	// Move focus to the confirmation when the form succeeds, so keyboard/SR users are told.
	$effect(() => {
		if (form?.success) thankYouHeading?.focus();
	});

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

	onMount(() => {
		isNavLight.set(true);
	});

	let viewportWidth = $state(0);
</script>

<svelte:window bind:innerWidth={viewportWidth} />

<Nav {navLinks} isLogoLarge={false} />

<section class="h-dvh w-screen snap-end fixed top-0 overflow-y-auto">
	<ContentWidth class="flex flex-col md:flex-row items-center justify-center mt-28 md:mt-48">
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
			<a
				href="tel:+14322428850"
				class="text-white mb-4 inline-block hover:opacity-80 transition-opacity">432.242.8850</a
			>
			<div class="button-text text-white">MESSAGE</div>
			<a
				href="mailto:info@erpfunds.com"
				class="text-white inline-block hover:opacity-80 transition-opacity">info@erpfunds.com</a
			>
		</div>
		<div class="w-full md:w-2/3 mt-10 mb-16 md:my-0 md:pl-16 relative">
			{#if !form?.success}
				{#if form?.error}
					<div
						class="absolute flex flex-col items-center justify-center -top-24 right-0 border-[#b21c0e] border-2 bg-black"
						transition:fade
						role="alert"
					>
						<h5 class="text-subtle-blue p-8">
							Something went wrong sending your message. Please check your details and try again.
						</h5>
					</div>
				{/if}
				<form
					class="w-full flex flex-col gap-8"
					name="contact"
					id="contact"
					method="POST"
					use:enhance={() => {
						submitting = true;
						return async ({ update }) => {
							await update();
							submitting = false;
						};
					}}
				>
					<h5 class="text-white">SEND US A MESSAGE</h5>

					<!-- Anti-bot: per-request timing token + a hidden honeypot. Naive bots
					     fill the honeypot; a too-fast fill is caught by the timing screen. -->
					<input type="hidden" name="ts" value={data.formTs} />
					<input
						type="text"
						name="bot-field"
						tabindex="-1"
						autocomplete="off"
						aria-hidden="true"
						class="hidden"
					/>

					<div class="w-full flex flex-col gap-8 md:gap-0 md:flex-row justify-between">
						<input
							type="email"
							name="email"
							placeholder="Your Email"
							aria-label="Your email"
							required
							class="md:w-[45%]"
						/>
						<select
							name="interest"
							class="md:w-[45%] cursor-pointer"
							aria-label="Area of interest"
							required
						>
							<option value="" disabled selected>Select Interest</option>
							<option value="Leasing">Leasing</option>
							<option value="Investor Relations">Investor Relations</option>
							<option value="Property Sales and Acquistions">Property Sales and Acquisitions</option>
						</select>
					</div>
					<div class="w-full">
						<textarea
							name="message"
							class="w-full h-48"
							placeholder="Your Message"
							aria-label="Your message"
							required
						></textarea>
					</div>
					<button
						type="submit"
						disabled={submitting}
						class="hover:bg-erp-blue border-white border-2 text-white active:bg-black w-full md:w-fit text-center mb-5 sm:mb-0 uppercase cursor-pointer text-nowrap transition-all duration-300 active:-translate-y-2 disabled:cursor-not-allowed disabled:opacity-70"
					>
						{#if !submitting}
							Submit
						{:else}
							<div><i class="fa fa-spin fa-circle-o-notch fa-2xl leading-4 w-4"></i></div>
						{/if}
					</button>
				</form>
			{/if}
			{#if form?.success}
				<div class="w-full h-72 flex flex-col items-center justify-center gap-16">
					<h5 class="text-white" bind:this={thankYouHeading} tabindex="-1">THANK YOU!</h5>
					<p class="text-white">
						We'll get back to you as soon as possible. In the meantime, explore our available
						properties.
					</p>
					<DefaultButton text="AVAILABILITIES" href="/industrial-portfolio" filled={false} />
				</div>
			{/if}
		</div>
	</ContentWidth>
	<div class="h-[20dvh]"></div>
</section>

{#if viewportWidth > 768}
	<Footer />
{/if}

<style>
	input,
	select,
	textarea {
		border-radius: 4px;
		background: #1d1c1c;
		padding: 12px;
	}
	input,
	textarea {
		color: white;
		resize: none;
	}
	input::placeholder,
	textarea::placeholder,
	select {
		color: #ffffff99;
	}

	button {
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

	@media only screen and (max-width: 768px) {
		button {
			font-style: normal;
			font-weight: 500;
			text-align: center;
			border-radius: 3px;
			padding: 10px;
		}
	}
</style>
