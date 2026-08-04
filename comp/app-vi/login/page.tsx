'use client';

import { FormState, login, loginWithGoogle } from '@/app/auth/actions';
import MainBnr from '@/components/MainBnr';
import Link from 'next/link';
import { useActionState } from 'react';

const LOGIN_ERROR_MSG: Record<string, string> = {
  empty: '입력하세요',
  invalid_credentials: '이메일 또는 비밀번호가 올바르지 않습니다.',
  email_not_confirmed: '이메일 인증이 완료되지 않았습니다. 메일함을 확인해주세요.',
  user_not_found: '존재하지 않는 회원 정보입니다.',
  over_request_rate_limit: '너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요.',
};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(login, {
    error: undefined,
    payload: { email: '' },
  });
  const errorMsg = state?.error
    ? LOGIN_ERROR_MSG[state.error] || '로그인 중 오류가 발생했습니다.'
    : null;

  return (
    <div className="flex flex-1 flex-col items-center justify-center font-sans">
      <main className="flex w-full max-w-3xl flex-1 flex-col">
        <div className="mt-10">
          <MainBnr />
        </div>
        <div className="bg-glass-tab">
          <form action={formAction}>
            <div>
              <input
                type="text"
                name="email"
                placeholder="이메일"
                defaultValue={state?.payload?.email || ''}
              />
            </div>
            <div>
              <input type="password" name="password" placeholder="비밀번호" />
            </div>
            <div className="mt-10">
              <button type="submit" disabled={isPending} className="bg-brand-500 w-full">
                로그인
              </button>
            </div>
          </form>
          <div className="mt-4">{errorMsg && <p className="text-red-500">{errorMsg}</p>}</div>

          <div className="flex">
            <Link href="/signup" className="mr-5">
              Sign up
            </Link>
            <form action={loginWithGoogle}>
              <button type="submit">OAUTH</button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
