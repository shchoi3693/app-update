"use client";

import { FormState, login, loginWithGoogle } from "@/app/auth/actions";
import Link from "next/link";
import { useActionState } from "react";

const LOGIN_ERROR_MSG: Record<string, string> = {
  empty: "입력하세요",
  invalid_credentials: "이메일 또는 비밀번호가 올바르지 않습니다.",
  email_not_confirmed:
    "이메일 인증이 완료되지 않았습니다. 메일함을 확인해주세요.",
  user_not_found: "존재하지 않는 회원 정보입니다.",
  over_request_rate_limit:
    "너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요.",
};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    login,
    {
      error: undefined,
      payload: { email: "" },
    },
  );
  const errorMsg = state?.error
    ? LOGIN_ERROR_MSG[state.error] || "로그인 중 오류가 발생했습니다."
    : null;

  return (
    <div>
      <form action={formAction}>
        <div>
          <input
            type="text"
            name="email"
            placeholder="이메일"
            defaultValue={state?.payload?.email || ""}
          />
        </div>
        <div>
          <input type="password" name="password" placeholder="비밀번호" />
        </div>
        <div className="mt-10">
          <button
            type="submit"
            disabled={isPending}
            className="bg-brand-500 w-full"
          >
            로그인
          </button>
        </div>
      </form>
      <div className="mt-4">
        {errorMsg && <p className="text-red-500">{errorMsg}</p>}
      </div>

      <div className="flex">
        <Link href="/signup" className="mr-5">
          Sign up
        </Link>
        <form action={loginWithGoogle}>
          <button type="submit">OAUTH</button>
        </form>
      </div>
    </div>
  );
}

---- actions.ts
("use server");

import { createClient } from "@/lib/supabase/server"; // supabase server
import { redirect } from "next/navigation";

export type FormState = {
  error?: string;
  payload?: {
    email?: string;
  };
};

export async function signup(prevState: FormState, formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "empty", payload: { email } };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "email_vallid", payload: { email } };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) return { error: error.code, payload: { email } };

  if (
    data.user &&
    (!data.user.identities || data.user.identities.length === 0)
  ) {
    return { error: "email_exists", payload: { email } };
  }

  redirect("/");
}

export async function login(prevState: FormState, formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "empty", payload: { email } };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) return { error: error.code, payload: { email } };

  redirect("/");
}

export async function loginWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });
  if (data.url) redirect(data.url);
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}


--- auth/callback/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

//google 인증 마치고 여기 서버로 redirect (auth/callback?code=XXXX)
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url); // origin: redirect 주소
  const code = searchParams.get('code'); // XXXX
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code); // access token + refresh token 교환, 쿠키 저장
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
