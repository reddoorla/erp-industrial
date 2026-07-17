import { createClient } from '$lib/prismicio';
import { createIngestAction } from '@reddoorla/maintenance/forms';
// Server-only secrets, read at runtime. Never exposed to the client (unlike VITE_-prefixed vars).
import { env } from '$env/dynamic/private';
import type { Actions, PageServerLoad } from './$types';

// A form `action` cannot run on a prerendered route ("Cannot prerender pages with actions").
export const prerender = false;

export const load: PageServerLoad = async ({ fetch, cookies }) => {
	const client = createClient({ fetch, cookies });
	const nav = await client.getSingle('nav');
	return {
		nav,
		// This route has no Prismic doc, so give the shared <title>/<meta> in +layout.svelte a
		// unique, sensible title instead of falling back to the bare site name (which would
		// duplicate other title-less pages). Description falls back to DEFAULT_DESCRIPTION.
		title: 'Contact — ERP Industrials',
		// Per-request timestamp for the bot timing screen (see +page.svelte honeypot/ts).
		formTs: Date.now()
	};
};

// Forwards the contact submission to the central @reddoorla/maintenance ingest
// (Airtable Submissions + dashboard + status-aware notify). Spam is handled by the
// built-in honeypot + fill-timing screen. `interest` rides along as an extra field;
// recipient routing happens dashboard-side via the site's Notify Routing config.
export const actions: Actions = {
	default: createIngestAction({
		formType: 'contact',
		getConfig: () => ({
			url: env.FORMS_INGEST_URL,
			token: env.FORMS_INGEST_TOKEN
		}),
		buildPayload: (form, event) => ({
			email: form.get('email')?.toString(),
			message: form.get('message')?.toString(),
			interest: form.get('interest')?.toString() || undefined, // → extraFields.interest, the routing key
			// Full URL incl. query string so UTM/campaign params (?utm_source=…) are captured.
			sourceUrl: event.url.href
		})
	})
};
