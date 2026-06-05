'use server';

import { createClient } from '@/lib/supabase/server'; // supabase server
import { redirect } from 'next/navigation';

export type FormState = {
  error?: string;
  payload?: {
    email?: string;
  };
};

export async function signup(prevState: FormState, formData: FormData) {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'empty', payload: { email } };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: 'email_vallid', payload: { email } };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) return { error: error.code, payload: { email } };

  if (data.user && (!data.user.identities || data.user.identities.length === 0)) {
    return { error: 'email_exists', payload: { email } };
  }

  redirect('/');
}

export async function login(prevState: FormState, formData: FormData) {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'empty', payload: { email } };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) return { error: error.code, payload: { email } };

  redirect('/');
}

export async function loginWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });
  if (data.url) redirect(data.url);
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}
