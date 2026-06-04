import { createClient } from '$lib/prismicio';
import { Resend } from 'resend';
import type { Actions, PageServerLoad } from './$types';
import { fail, type ActionFailure } from '@sveltejs/kit';
import { dev } from '$app/environment';
// Server-only secrets, read at runtime. Never exposed to the client (unlike VITE_-prefixed vars).
import { env } from '$env/dynamic/private';

const FROM_ADDRESS = 'ERP Site Submission <submissions@reddoorla.com>';

export const load: PageServerLoad = async ({ fetch, cookies }) => {
	const client = createClient({ fetch, cookies });
	const nav = await client.getSingle('nav');
	return {
		nav
	};
};

type ActionResponse = {
	success: boolean;
};

export const actions: Actions = {
	default: async ({ request }): Promise<ActionResponse | ActionFailure<{ error: string }>> => {
		const formData = await request.formData();

		const email = formData.get('email')?.toString() || '';
		const interest = formData.get('interest')?.toString() || '';
		const message = formData.get('message')?.toString() || '';
		const recaptchaToken = formData.get('g-recaptcha-response')?.toString() || '';
		let sendTo = ['tucker@reddoorla.com'];

		const resendApiKey = env.RESEND_API_KEY;
		if (!resendApiKey) {
			console.error('Contact form misconfigured: RESEND_API_KEY not set');
			return fail(500, { error: 'Server misconfiguration' });
		}

		// reCAPTCHA is enforced in production only; skipped in local dev so the email path can be
		// tested without allow-listing localhost on the Enterprise key.
		if (!dev && !recaptchaToken) {
			return fail(400, { error: 'no reCaptcha token' });
		}

		switch (interest) {
			case 'Leasing':
				sendTo = ['Brennan Berry <BBerry@erpfunds.com>', 'tucker@reddoorla.com'];
				break;

			case 'Investor Relations':
				sendTo = ['Pippi Espinoza <pespinoza@erpfunds.com>', 'tucker@reddoorla.com'];
				break;

			case 'Property Sales and Acquistions':
				sendTo = ['Meghan Berry <MBerry@erpfunds.com>', 'tucker@reddoorla.com'];
				break;
		}

		if (!email || !interest || !message || interest === 'Select Interest')
			return fail(400, { error: 'Missing required fields' });

		// In dev, route everything to a single test inbox if configured, so local testing never
		// emails the real recipients above.
		if (dev && env.CONTACT_TEST_EMAIL) {
			sendTo = [env.CONTACT_TEST_EMAIL];
		}

		if (!dev) {
			const recaptchaSecretKey = env.RECAPTCHA_SECRET_KEY;
			if (!recaptchaSecretKey) {
				console.error('Contact form misconfigured: RECAPTCHA_SECRET_KEY not set');
				return fail(500, { error: 'Server misconfiguration' });
			}

			try {
				const recaptchaResponse = await fetch(
					`https://recaptchaenterprise.googleapis.com/v1/projects/energy-related-properties/assessments?key=${recaptchaSecretKey}`,
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							event: {
								token: recaptchaToken,
								siteKey: import.meta.env.VITE_RECAPTCHA_SITE_KEY,
								expectedAction: 'SUBMIT'
							}
						})
					}
				);

				const recaptchaResult = await recaptchaResponse.json();

				if (!recaptchaResult.tokenProperties?.valid || recaptchaResult.riskAnalysis?.score < 0.5) {
					return fail(400, { error: 'reCAPTCHA verification failed' });
				}
			} catch (error) {
				console.error('reCAPTCHA verification error:', error);
				return fail(500, { error: 'An error occurred during verification' });
			}
		}

		try {
			const resend = new Resend(resendApiKey);
			const { data, error } = await resend.emails.send({
				from: FROM_ADDRESS,
				to: sendTo,
				replyTo: email,
				subject: `${interest} Inquiry from ${email}`,
				text: message
			});

			if (error) {
				console.error('Resend error:', error);
				return fail(500, { error: 'Failed to send email' });
			}
			if (!data?.id) {
				console.error('Resend returned no message id');
				return fail(500, { error: 'Failed to send email' });
			}

			return { success: true };
		} catch (error) {
			console.error(error);
			return fail(500, { error: 'Failed to send email' });
		}
	}
};

export const prerender = false;
