

import { createClient } from '$lib/prismicio';

export async function load({ fetch, cookies }) {
	const client = createClient({ fetch, cookies });

	const nav = await client.getSingle('nav');

	return {
		nav
	};
}


export const actions = {
	default: async ({ request }) => {

        const formData = await request.formData();
        
        fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formData,
        })
          .then(() => console.log("Form successfully submitted"))
          .catch((error) => console.log(error));
	}
};

export const prerender = false;