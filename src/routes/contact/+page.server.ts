import { createClient } from '$lib/prismicio';
import sgMail from '@sendgrid/mail';
import type { Actions, PageServerLoad } from './$types';
import { fail, type ActionFailure } from '@sveltejs/kit';

sgMail.setApiKey(import.meta.env.VITE_SENDGRID_KEY);

export const load: PageServerLoad = async ({ fetch, cookies }) => {
  const client = createClient({ fetch, cookies });
  const nav = await client.getSingle('nav');
  return {
    nav,
  };
};

type ActionResponse = {
  success: boolean;
};


export const actions: Actions = {
  default: async ({ request }): Promise<ActionResponse|ActionFailure<{ error: string; }>> => {
    const formData = await request.formData();

    const email = formData.get('email')?.toString() || '';
    const interest = formData.get('interest')?.toString() || '';
    const message = formData.get('message')?.toString() || '';
    let sendTo = ['tucker@reddoorla.com'];

    switch(interest){
      case "Leasing":
        sendTo = ['Brennan Berry <BBerry@erpfunds.com>','Tucker Lemos <tucker@reddoorla.com>'];
        break;
      
      case "Investor Relations":
        sendTo = ['wmeyer@erpfunds.com'];
        break;

      case "Property Sales and Acquistions":
        sendTo = ['MBerry@erpfunds.com'];
        break;
  }
    
    
    if(!email || !interest || !message || interest==='Select Interest') return fail(400, { error: 'Missing required fields' });

    const msg = {
      to: 'tucker@reddoorla.com',
      from: 'tucker@reddoorla.com',
      replyTo: email,
      subject:interest + ' Inquiry from ' + email,
      text: message,
    };

    try {
      await sgMail.send(msg);
      console.log('Email sent');
      return { success: true };
    } catch (error) {
      console.error(error);
      return fail(500, { error: 'Failed to send email' });
    }
  },
};

export const prerender = false;