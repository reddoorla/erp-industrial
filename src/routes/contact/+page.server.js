

import { createClient } from '$lib/prismicio';
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(import.meta.env.VITE_SENDGRID_KEY)



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

        const msg = {
            to: "tucker@reddoorla.com", // Change to your recipient
            from: "tucker@reddoorla.com",
            replyTo: formData.get("email")?.toString()||"", 
            subject: (formData.get("interest")?.toString()==='Select Interest'? "Website" : formData.get("interest")?.toString()) + " Inquiry from "  + formData.get("email")?.toString(),
            text: formData.get("message")?.toString() || "",
          }

        sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent')
        })
        .catch((error) => {
            console.error(error)
        })

        console.log(formData);
        
    }
}

export const prerender = false;