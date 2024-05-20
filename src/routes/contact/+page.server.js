

import { createClient } from '$lib/prismicio';

export async function load({ fetch, cookies }) {
	const client = createClient({ fetch, cookies });

	const nav = await client.getSingle('nav');

	return {
		nav
	};
}


export const actions = {
	default: async (event) => {
		
	}
};

export const prerender = false;