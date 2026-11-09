import type { Handle } from '@sveltejs/kit/hooks';

import { legacyRedirect } from '$lib/legacy-redirects';

export const handle: Handle = async ({ event, resolve }) => {
	// Old URLs Google still serves go to their successors ($lib/legacy-redirects says why).
	const legacy = legacyRedirect(event.url.pathname);
	if (legacy) return new Response(null, { status: 301, headers: { location: legacy } });
	return resolve(event);
};
