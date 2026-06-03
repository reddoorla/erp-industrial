import { asText } from '@prismicio/client';

import { createClient } from '$lib/prismicio';

export async function load({ params, fetch, cookies }) {
	const client = createClient({ fetch, cookies });

	const page = await client.getByUID('page', params.uid);
	const nav = await client.getSingle('nav');
	if (page) {
		return {
			page,
			nav,
			title: asText(page.data.title),
			meta_description: page.data.meta_description,
			meta_title: page.data.meta_title,
			meta_image: page.data.meta_image.url
		};
	} else {
		const homepage = await client.getByUID('page', 'home');

		return {
			page: homepage,
			nav,
			title: asText(homepage.data.title),
			meta_description: homepage.data.meta_description,
			meta_title: homepage.data.meta_title,
			meta_image: homepage.data.meta_image.url
		};
	}
}

export async function entries() {
	const client = createClient();

	const pages = await client.getAllByType('page');

	return pages.map((page) => {
		return { uid: page.uid };
	});
}
