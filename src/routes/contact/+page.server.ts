import { createClient } from '$lib/prismicio';
import sgMail from '@sendgrid/mail';
import type { Actions, PageServerLoad } from './$types';
import { fail, type ActionFailure } from '@sveltejs/kit';
// Server-only secrets, read at runtime. Never exposed to the client (unlike VITE_-prefixed vars).
import { env } from '$env/dynamic/private';

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
		let sendTo = ['ERP Site Submission <tucker@reddoorla.com>'];

		if (!recaptchaToken) {
			return fail(400, { error: 'no reCaptcha token' });
		}

		const sendgridKey = env.SENDGRID_KEY;
		const recaptchaSecretKey = env.RECAPTCHA_SECRET_KEY;
		if (!sendgridKey || !recaptchaSecretKey) {
			console.error('Contact form misconfigured: SENDGRID_KEY / RECAPTCHA_SECRET_KEY not set');
			return fail(500, { error: 'Server misconfiguration' });
		}

		switch (interest) {
			case 'Leasing':
				sendTo = ['Brennan Berry <BBerry@erpfunds.com>', 'tucksravine1@gmail.com'];
				break;

			case 'Investor Relations':
				sendTo = ['Pippi Espinoza <pespinoza@erpfunds.com>', 'tucksravine1@gmail.com'];
				break;

			case 'Property Sales and Acquistions':
				sendTo = [ 'tucksravine1@gmail.com'];
				break;
		}

		if (!email || !interest || !message || interest === 'Select Interest')
			return fail(400, { error: 'Missing required fields' });

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

		const msg = {
			to: sendTo,
			from: 'ERP Site Submission<tucker@reddoorla.com>',
			replyTo: email,
			subject: interest + ' Inquiry from ' + email,
			text: message
		};

		try {
			sgMail.setApiKey(sendgridKey);
			await sgMail.send(msg);
			return { success: true };
		} catch (error) {
			console.error(error);
			return fail(500, { error: 'Failed to send email' });
		}
	}
};

export const prerender = false;
