'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAdmin(formData: FormData) {
  const password = formData.get('password') as string;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (password === adminPassword) {
    // Set a secure cookie that expires in 1 day
    (await cookies()).set('admin_auth', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    });
    
    redirect('/admin');
  }

  return { error: 'Invalid password' };
}

export async function logoutAdmin() {
  (await cookies()).delete('admin_auth');
  redirect('/admin/login');
}
