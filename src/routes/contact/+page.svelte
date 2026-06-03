<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
	import Nav from '$lib/components/Nav.svelte';
	import * as prismicHelpers from '@prismicio/helpers';
	import ContentWidth from '$lib/components/ContentWidth.svelte';
	import DefaultButton from '$lib/components/Buttons/DefaultButton.svelte';
	import { fade } from 'svelte/transition';

	let navLinks = [{ href: '', text: '' }];

	import type { NavDocumentDataLinksItem } from '../../prismicio-types';
	data.nav.data.links.forEach((link: NavDocumentDataLinksItem) => {
		navLinks.push({
			href: prismicHelpers.isFilled.link(link.href) ? link.href.url || '#' : '#',
			text: link.text || ''
		});
	});

	let isEmailSent = $state(false);
	let isEmailSending = $state(false);
	let isEmailFailed = $state(false);

	// Public reCAPTCHA Enterprise site key — single source of truth for the loader script and
	// execute() call so they can never drift (the previous env var was undefined locally, which
	// caused "No reCAPTCHA clients exist"). Site keys are public by design.
	const RECAPTCHA_SITE_KEY = '6LcgrQUqAAAAAGSwikmSpKfzVBS8SjC4Gd1GAKP_';

	async function executeReCaptcha(): Promise<string> {
		// @ts-expect-error grecaptcha is a global injected by reCAPTCHA enterprise script
		const grecaptcha = window.grecaptcha?.enterprise;
		if (!grecaptcha) {
			console.error('reCAPTCHA is not loaded');
			throw new Error('reCAPTCHA not loaded');
		}
		try {
			// Ensure the client is registered before executing, else execute() can throw.
			await new Promise<void>((resolve) => grecaptcha.ready(resolve));
			// execute() hangs indefinitely if the current domain isn't allow-listed for the site key
			// (e.g. localhost), so race it against a timeout instead of leaving Submit spinning forever.
			return await Promise.race([
				grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'submit' }) as Promise<string>,
				new Promise<string>((_, reject) =>
					setTimeout(() => reject(new Error('reCAPTCHA timed out')), 10000)
				)
			]);
		} catch (error) {
			console.error('reCAPTCHA execution failed:', error);
			throw error;
		}
	}

	let reCaptchaToken = '';

	async function handleSubmit(event: Event) {
		event.preventDefault();
		isEmailSending = true;
		isEmailSent = false;
		isEmailFailed = false;

		try {
			reCaptchaToken = await executeReCaptcha();
			const form = event.target as HTMLFormElement;
			const formData = new FormData(form);
			formData.append('g-recaptcha-response', reCaptchaToken);
			console.log(reCaptchaToken);

			const response = await fetch(form.action, {
				method: 'POST',
				body: formData
			});

			const result = await response.json();

			if (response.ok) {
				isEmailSent = true;
			} else {
				isEmailFailed = true;
				console.error('Submission failed:', result);
			}
		} catch (error) {
			console.error('Error during form submission:', error);
			isEmailFailed = true;
		} finally {
			isEmailSending = false;
		}
	}

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
<svelte:head>
	<script src="https://www.google.com/recaptcha/enterprise.js?render={RECAPTCHA_SITE_KEY}"></script>
</svelte:head>

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
					<div
						class="absolute flex flex-col items-center justify-center -top-24 right-0 border-[#b21c0e] border-2 bg-black"
						transition:fade
					>
						<h5 class="text-subtle-blue p-8">
							Something went wrong. Please fill all fields and retry.
						</h5>
					</div>
				{/if}
				<form
					class="w-full flex flex-col gap-8"
					name="contact"
					id="contact"
					method="POST"
					onsubmit={(e) => {
						e.preventDefault();
						handleSubmit(e);
					}}
				>
					<h5 class="text-white">SEND US A MESSAGE</h5>
					<div class="w-full flex flex-col gap-8 md:gap-0 md:flex-row justify-between">
						<input type="email" name="email" placeholder="Your Email" class="md:w-[45%]" />
						<select name="interest" class="md:w-[45%] cursor-pointer" placeholder="Select Interest">
							<option class="text-gr">Select Interest</option>
							<option value="Leasing">Leasing</option>
							<option value="Investor Relations">Investor Relations</option>
							<option value="Property Sales and Acquistions">Property Sales and Acquisition</option>
						</select>
					</div>
					<div class="w-full">
						<textarea name="message" class="w-full h-48" placeholder="Your Message"></textarea>
					</div>
					<button
						type="submit"
						class="hover:bg-erp-blue border-white border-2 text-white active:bg-black w-full md:w-fit text-center mb-5 sm:mb-0 uppercase cursor-pointer text-nowrap transition-all duration-300 active:-translate-y-2"
					>
						{#if !isEmailSending}
							Submit
						{:else}
							<div><i class="fa fa-spin fa-circle-o-notch fa-2xl leading-4 w-4"></i></div>
						{/if}
					</button>
				</form>
			{/if}
			{#if isEmailSent}
				<div class="w-full h-72 flex flex-col items-center justify-center gap-16">
					<h5 class="text-white">THANK YOU!</h5>
					<p class="text-white">
						We'll get back to you as soon as possible. In the meantime, explore our available
						properties.
					</p>
					<DefaultButton text="AVAILABILITIES" href="/industrial-portfolio" filled={false} />
				</div>
			{/if}
		</div>
	</ContentWidth>
	<div class="h-[20vh]"></div>
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
