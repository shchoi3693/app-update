'use client';

import { FormState, signup } from '@/app/auth/actions';
import { useActionState } from 'react';

const SIGNUP_ERROR_MSG: Record<string, string> = {
  empty: '입력하세요',
  AuthWeakPasswordError: '1',
  weak_password: '8자 이상',
  email_exists: '이미 가입',
  email_vallid: '이메일 형식이 올바르지 않습니다.',
  email_address_invalid: '사용할 수 없는 이메일 주소입니다.',
  over_email_send_rate_limit: 'limit',
};

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(signup, {
    error: undefined,
    payload: { email: '' },
  });
  console.log(state?.error);
  const errorMsg = state?.error
    ? SIGNUP_ERROR_MSG[state.error] || '회원가입 중 오류가 발생했습니다.'
    : null;

  return (
    <>
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
            가입
          </button>
        </div>
        <div className="mt-10">{errorMsg && <p className="text-red-500">{errorMsg}</p>}</div>
      </form>
    </>
  );
}
