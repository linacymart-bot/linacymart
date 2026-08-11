'use server';

import { createClient } from '@/utils/supabase/server';
import { z } from 'zod';

const membershipSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(9, 'Phone number is required'),
  countyId: z.string().uuid('Please select your location'),
  message: z.string().optional(),
});

export async function submitMembershipLead(formData: FormData) {
  try {
    const payload = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      countyId: formData.get('countyId') as string,
      message: formData.get('message') as string,
    };

    const validatedData = membershipSchema.parse(payload);
    const supabase = await createClient();

    const { error } = await supabase
      .from('membership_leads')
      .insert({
        name: validatedData.name,
        phone: validatedData.phone,
        county_id: validatedData.countyId,
        message: validatedData.message || null,
        status: 'new',
      });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to submit application.' };
  }
}
