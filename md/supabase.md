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


## Supabase Auth UI
> 로그인 라이브러리

```bash
pnpm add @supabase/auth-ui-react @supabase/auth-ui-shared
```

```tsx
// 확인
supabase.auth.getSession();
// 로그아웃
supabase.auth.signOut();
```
```tsx
<Auth
	supabaseClient={supabase}
	appearance={테마}
	// 로그인 방식
	providers={['google', 'github']}
	// Label
	localization={{
		variables: {
			sign_in: {
				email_label: '이메일 주소',
				password_label: '비밀번호',
				button_label: '로그인하기',
			},
			sign_up: {
				button_label: '회원가입하기',
			}
		}
	}}
>
```
- supabase 서버 컴포넌트는 쿠키를 읽을수만 있으므로 next의 middleware 에 위임
```ts:title=src/lib/supabase/middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);

            response = NextResponse.next({
              request,
            });

            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  return response;
}
```
### `NextResponse`
- 서버측 제어권 제공
- Cookie get, set
- Redirect : 로그인 시 페이지 이동
- Rewrite : URL 그대로 유지하면서 내부 컨텐츠 변경














- [Zustand 로그인 세션 관리]
