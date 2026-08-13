'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function loginCustomer(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const redirectTo = formData.get('redirectTo') as string || '/account';
  
  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect(redirectTo);
}

export async function signupCustomer(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;
  const fullName = formData.get('fullName') as string;
  
  if (!email || !password || !fullName) {
    return { error: 'All fields are required' };
  }
  
  if (password !== confirmPassword) {
    return { error: 'Passwords do not match' };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  redirect('/account');
}

export async function resetPassword(formData: FormData) {
  const email = formData.get('email') as string;
  
  if (!email) {
    return { error: 'Email is required' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/account/reset-password-confirm`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function logoutCustomer() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
