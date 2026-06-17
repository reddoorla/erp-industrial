<script lang="ts">
	import ContentWidth from './ContentWidth.svelte';
	import logoFull from '../assets/fullLogo.webp';
	import loopnet from '../assets/icons/loopnet.svg';
	import DefaultButton from './Buttons/DefaultButton.svelte';

	let viewportWidth: number;
</script>

<svelte:window bind:innerWidth={viewportWidth} />

<div class="bg-black w-screen sticky snap-end h-dvh top-0 md:h-[20dvh] md:top-[80dvh] z-40">
	<ContentWidth class="flex flex-row pt-6 h-full py-32 md:py-6">
		{#if viewportWidth > 768}
			<div class="h-full w-1/3 relative">
				<a
					href="/"
					class="w-[25%] hover:opacity-80 transition-all duration-500 bump brightness-0 invert relative block"
				>
					<img src={logoFull} alt="ERP Industrials" class="w-full" />
				</a>
			</div>
			<div class="h-full w-1/6 flex flex-col gap-4">
				<a href="/about" class="footer-link">ABOUT</a>
				<a href="/portfolio" class="footer-link">INDUSTRIAL PORTFOLIO</a>
				<a href="/investors" class="footer-link">INVESTORS</a>
				<a href="/office" class="footer-link">OFFICE</a>
			</div>
			<div class="h-full w-1/6 flex flex-col gap-4">
				<a href="https://icx.efrontcloud.com/@9894/ERP/login.aspx" class="footer-link"
					>PE INVESTOR PORTAL</a
				>
				<a href="https://starportal2.star.vistra.com/erp/#/index" class="footer-link"
					>DST INVESTOR PORTAL</a
				>
				<a
					href="https://tenantportal-erpfunds.securecafe3.com/newtenantportal/content2/login/?companyId=161"
					class="footer-link">TENANT PORTAL</a
				>
			</div>
			<div class="h-full w-1/12"></div>
			<div class="h-full w-1/4 flex flex-col gap-8">
				<div class="w-full flex flex-row h-6 gap-6 text-subtle-blue">
					<a
						href="https://www.linkedin.com/company/erp-industrials/"
						class="text-xl"
						aria-label="LinkedIn"
						><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="size-[1em]"
							><path
								d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"
							/></svg
						></a
					>
					<a
						href="https://www.facebook.com/ERPFunds/"
						class="text-lg translate-y-[-2px]"
						aria-label="Facebook"
						><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="size-[1em]"
							><path
								d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
							/></svg
						></a
					>
					<a
						href="https://www.loopnet.com/company/erp-industrials/midland-tx/9rvtzp4l/"
						class="scale-105"><img src={loopnet} alt="loopnet" /></a
					>
				</div>
				<a href="/contact">
					<DefaultButton text="Contact" filled={false} class="text-white border-2 border-white" />
				</a>
			</div>
		{:else}
			<div class="w-full h-full flex flex-col gap-8 justify-end relative">
				<a
					href="/"
					class="h-12 hover:opacity-80 transition-all duration-500 bump brightness-0 invert block translate-y-2 absolute top-4"
				>
					<img src={logoFull} alt="ERP Industrials" class="h-12" />
				</a>
				<a href="/about" class="footer-link">ABOUT</a>
				<a href="/portfolio" class="footer-link">INDUSTRIAL PORTFOLIO</a>
				<a href="/investors" class="footer-link">INVESTORS</a>
				<a href="https://icx.efrontcloud.com/@9894/ERP/login.aspx" class="footer-link"
					>PE INVESTOR PORTAL</a
				>
				<a href="https://starportal2.star.vistra.com/erp/#/index" class="footer-link"
					>DST INVESTOR PORTAL</a
				>
				<a
					href="https://tenantportal-erpfunds.securecafe3.com/newtenantportal/content2/login/?companyId=161"
					class="footer-link">TENANT PORTAL</a
				>
				<div class="w-full flex flex-row items-center gap-2 text-subtle-blue">
					<a
						href="https://www.linkedin.com/company/erp-industrials/"
						class="text-xl inline-flex items-center justify-center min-h-11 min-w-11"
						aria-label="LinkedIn"
						><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="size-[1em]"
							><path
								d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"
							/></svg
						></a
					>
					<a
						href="https://www.facebook.com/ERPFunds/"
						class="text-lg inline-flex items-center justify-center min-h-11 min-w-11"
						aria-label="Facebook"
						><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="size-[1em]"
							><path
								d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
							/></svg
						></a
					>
					<a
						href="https://www.loopnet.com/company/erp-industrials/midland-tx/9rvtzp4l/"
						class="inline-flex items-center justify-center min-h-11 min-w-11"
						aria-label="LoopNet"
						><img src={loopnet} class="scale-105" alt="ERP Industrials on LoopNet" /></a
					>
				</div>
				<a href="/contact">
					<DefaultButton text="Contact" filled={false} class="text-white border-2 border-white" />
				</a>
			</div>
		{/if}
	</ContentWidth>
</div>

<style>
	.footer-link {
		color: var(--ffffff, #fff);
		display: inline-block;
		padding: 0.5rem 0;

		font-feature-settings:
			'clig' off,
			'liga' off;

		/* Button - all caps */

		font-size: 10px;
		font-style: normal;
		font-weight: 500;
		line-height: 145%; /* 11.6px */
		letter-spacing: 2px;
		text-transform: uppercase;
	}

	a {
		transition: opacity 400ms ease;
	}
	a:hover {
		opacity: 0.8;
	}
</style>
