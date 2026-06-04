---
date: '2026-05-06'
title: 'Supabase'
categories: ['Visual UI']
summary: 'css, css trick'
thumbnail: './gatsby-starter.jpg'
---

> PostSQL 기반 오픈소스 BaaS(Backend as a Service) 플랫폼

- Firebase 대안
- 데이터 베이스, 사용자 인증, 실시간 데이터, 스토리지 등 기능 제공

## 설정 Next 16(App Router)
```bash
pnpm add @supabase/ssr @supabase/supabase-js
```

### 환경변수
```title=.env.local
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```
- `NEXT_PUBLIC_` : 클라이언트 컴포넌트에서도 접근

### 파일 분리 (lib/supabase)
- `client.ts` : `use client` 컴포넌트 사용
- `server.ts` : 서버 컴포넌트
- `middleware.ts` : 루트에 위치, 세션 갱신

```ts:title=src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```
```ts:title=src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component에서는 쿠키를 수정할 수 없으므로 에러가 나도 무시합니다.
            // middleware나 Server Action에서 처리하게 됩니다.
          }
        },
      },
    }
  )
}
```


## 스키마 (PostgreSQL)
&nbsp; | &nbsp;
:----|:-----
`UUID` | 고유 식별자
`PRIMARY KEY` | column 한 번만 정의
`NOT NULL` | 값이 꼭 있어야함
`REFERENCES` | 다른 테이블 참조
`UNIQUE` | 중복되면 안됨

### 삭제
```sql
DROP TABLE IF EXISTS 테이블 CASCADE;

-- 함수 및 트리거 삭제
DROP FUNCTION IF EXISTS 함수 CASCADE;
```

## Method
&nbsp;               | &nbsp;
:--------------------|:-----
`.from('테이블 명')`  | 대상 테이블 지정
`.select('column1, column2)` | 지정된 테이블의 column 선택 <br /> `.select()` `.select(*)` 모든 column 선택
`.eq('column', 'value')` | 지정한 값과 일치하는 데이터만 필터링
`.single()` | 결과 배열에서 객체 추출 <br /> 데이터 1 (0 이거나 2이상 에러)
`.maybeSingle()` | 데이터 0 또는 1 (2이상 에러) : 존재 여부 확인
`.insert()` | 데이터 추가, 객체형태로 전달 <br /> `.insert({name: 'new'})` <br /> `.insert([{name: 'new 1'}, {name: 'new 2'}])` <br /> `.insert({...}).select().single()` : 아이템 추가 후 리스트에 바로 보여줘야하는 경우
`.upsert()` | Update + Insert 여러 데이터 한번에 추가


## Next 16 + Supabase Auth

### 1. middleware
#### Supabase middleware 헬퍼
- supabase 서버 컴포넌트는 쿠키를 읽을수만 있으므로 쿠키 set을 next의 middleware에 위임
- 인증 토큰 확인, 갱신
- 쿠키 토큰 검사 후 [NextResponse](/nextresponse) 객체 받기 
```ts:title=src/lib/supabase/middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
	// 토큰 갱신 시 다시 set
	let supabaseResponse = NextResponse.next({ request });

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll();
				},

				// 토큰 갱신 시 Supabase가 자동 호출 (getUser())
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
					// 객체 새로 만들기
					supabaseResponse = NextResponse.next({ request });
					// 쿠키 set
					cookiesToSet.forEach(({ name, value, options }) =>
						response.cookies.set(name, value, options),
					);
				},
			},
		},
	);

	// 세션 갱신 (만료 시 자동 refresh)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 보호 라우트 처리
  const { pathname } = request.nextUrl; // 현재 사용자가 요청한 경로
  const isPublic =
    pathname === '/' || pathname.startsWith('/signup') || pathname.startsWith('/login');
  const isAuthPage = pathname.startsWith('/signup') || pathname.startsWith('/login');

  if ((!user && !isPublic) || (user && isAuthPage)) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
```
- `request.url` "https://..." (string)
- `request.nextUrl` NextURL 객체  
  - `request.nextUrl.clone()` 원본 URL 객체를 복사한 뒤 수정 &rightarrow; 도메인, 프로토콜 자동으로 유지, 원본이 오염되지 않음
- `getSession` Client 측 확인, 반복적 조회해야하는 경우
- `getUser` Server 측 확인, 항상 최신의 인증 정보 제공, 보안 강화

#### next middleware
```ts:title=src/middleware.ts
import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * 제외:
     * - _next/static
     * - _next/image
     * - favicon.ico
     * - 이미지 확장자
     * - .well-known
     */
    '/((?!_next/static|_next/image|favicon.ico|.well-known|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

### 2. Server Actions
- form 제출 처리, 상태 반환
```
NEXT_PUBLIC_SITE_URL=http://localhost:3000        # 개발
NEXT_PUBLIC_SITE_URL=https://myapp.com            # 배포
```

#### 1. URL 쿼리 파라미터
```ts:title=src/app/auth/actions.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function signUp(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  });
  if (error) redirect('/signup?error=' + error.message);
  redirect('/signup?message=check_email');
}

export async function login(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  });
  if (error) redirect('/login?error=' + error.message);
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
```

#### 2. useActionState 사용
> React 19 이상 폼 처리 방식  
> Server Action 에러 객체 반환, 클라이언트에서 Hook으로 받아 처리
- React 18 이전 `useFormState`

```tsx
export async function login(prevState, formData){ // (이전 상태, FormData)
  ...
}
```
```tsx
const [state, formAction, isPending] = useActionState(login, initialState) // (실행할 Server Action, 초기 상태값)
```

- 사용 예시
```ts:title=src/app/auth/action.ts
'use server';

import { createClient } from '@/lib/supabase/server';
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
```
```tsx:title=src/app/signup/page.tsx
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
```

#### OAuth (Google Auth)
- 소셜 로그인
- 각 인증 마친 후 redirect `(auth/callback?code=XXXX)`
```ts:title=src/app/auth/callback/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

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
```
- `login` `loginWithGoogle` 비교  
  - 사용자 &rightarrow; Supabase 세션 발급  
  - 사용자 &rightarrow; Google 서버 왕복 &rightarrow; `/auth/callback` 에서 토큰 교환(`exchangeCodeForSession`)


### 3. Server Component에서 유저정보 가져오기
```tsx:title=src/app/page.tsx
import { createClient } from '@/lib/supabase/server';

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
 
  ...
}
```

### 4. Pages
#### 로그인, 회원가입
```tsx:title=src/app/login/page.tsx
import { login } from '@/app/auth/actions';
import Link from 'next/link';

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <>
      <form action={login}>
        <input type="email" name="email" placeholder="이메일" required />
        <input type="password" name="password" placeholder="비밀번호" required />
        <button type="submit">Login</button>
      </form>
      {error && <p className="text-red-500">{error}</p>}

      <Link href="/signup">Sign up</Link>
    </>
  );
}
```
```tsx:title=src/app/signup/page.tsx
import { signUp } from '@/app/auth/actions';

export default async function Signup({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const { error, message } = await searchParams;
  return (
    <>
      <form action={signUp}>
        <input type="email" name="email" placeholder="이메일" required />
        <input type="password" name="password" placeholder="비밀번호" required />

        {error && <p className="text-red-500">{error}</p>}
        {message === 'check_email' && <p className="text-red-500">확인</p>}
        <button type="submit">가입</button>
      </form>
    </>
  );
}
```
#### Sub pages
- Server Component에서 props로 직접 전달
```tsx:title=src/app/playlist/page.tsx
import Search from '@/components/search/Search';
import Turntable from '@/components/turntable/Turntable';
import AlbumCoverList from '@/components/AlbumCoverList';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function Playlist() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/');
  return (
    <div>
      <Search userId={user.id} />
      <AlbumCoverList userId={user.id} />
      <Turntable />
    </div>
  );
}
```
```tsx
export default function Search({ userId }: { userId: string }) {}
```

### 5. Client에서 유저정보 가져오기 (AuthProvider)
- provider 전역 설정, 상태 관리
- 인증 상태 전환 UI (로그인/로그아웃 이벤트 감지)
```tsx:title=layout.tsx
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <TanstackProvider>
          <AuthProvider>{children}</AuthProvider>
        </TanstackProvider>
      </body>
    </html>
  );
}
```
```tsx:title=src/providers/AuthProvider.tsx
'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

const AuthContext = createContext<{ user: User | null } | null>(null); // 전역 state 관리

export default function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null); // user state

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user); // 쿠키에 세션 있으면 User, 없으면 null
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe(); // unmount 시 subscription 해제
  }, []);

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
}

export function useUser() {
  return useContext(AuthContext); // 전역 state 값 꺼내기
}
```
- `createContext` 전역 State (user) 관리
- `onAuthStateChange((event, session)=>{})`  
  - `'INITIAL_SESSION', 'SIGNED_IN', ...` 각 이벤트
  - `session.user` state 업데이트



