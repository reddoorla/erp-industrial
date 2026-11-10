import type { Handle } from '@sveltejs/kit/hooks';

import { legacyLocation } from '$lib/legacy-redirects';

export const handle: Handle = async ({ event, resolve }) => {
	// Old URLs that 404ed go to their successors, query string kept ($lib/legacy-redirects says
	// which and why). For a client-side data request kit itself turns this 301 into its JSON
	// redirect (kit's respond.js, "If user does `return Response(30x)` in handle hook").
	const location = legacyLocation(event.url);
	if (location) return new Response(null, { status: 301, headers: { location } });
	return resolve(event);
};
