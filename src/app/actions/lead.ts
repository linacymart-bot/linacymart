'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitLeadForm(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const location = formData.get('location') as string;
    const message = formData.get('message') as string;
    const email = formData.get('email') as string || 'Not provided';

    if (!name || !phone || !location) {
      return { success: false, error: 'Name, phone, and location are required.' };
    }

    // In a real production app with a verified domain, you would use a verified sender email like onboarding@resend.dev
    // For now, we will send it to the business owner.
    
    // NOTE: Make sure the 'to' email address is the one you verified when creating your Resend account, 
    // unless you have a fully verified custom domain.
    
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>', // Keep this as onboarding@resend.dev until you verify a domain
      to: ['linacymart@gmail.com'], // The user will need to change this to their verified email
      subject: `New Distributor Lead: ${name}`,
      html: `
        <h2>New Distributor Application</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Location:</strong> ${location}</p>
        <p><strong>Message/Goals:</strong><br/> ${message || 'None'}</p>
      `,
    });

    if (error) {
      console.error('Resend Error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error('Server Action Error:', error);
    return { success: false, error: error.message || 'An unexpected error occurred.' };
  }
}
