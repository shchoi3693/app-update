---
date: '2026-05-11'
title: 'Next.js 16'
categories: ['Modern Stack']
summary: 'Next.js 16 버전, NextResponse'
thumbnail: './img1.jpg'
---

> Vercel에서 개발한 React 프레임워크

### Next 16 업데이트 내용
- `middleware.ts` `proxy.ts`로 변경
- `searchParams` `cookies()` `headers()` 비동기로 접근
- Turbopack 기본 값. Webpack 로더 지원 [사용예시](/svgr/#next-16-세팅)

## Server | Client
### Server Component
- cookies
- headers
- redirect

### Client Component
- useState, useEffect
- onClick, onChange
- useRouter
- useParams, useSearchParams
- useFormState

## Pages
- `app` 폴더에 `page.tsx` 파일로 라우트 정의 (App Router)
- 기본이 Server Componenet로 Client Component 사용 시 `'use client'` 선언
- 페이지 이동 시 `<Link>` 또는 `useRouter` 훅 사용
- 데이터 패치 시 Server Component에서 바로 `async | await`
- `app/not-found.tsx` 404 페이지
- 프로젝트 구조
```
├─app/
│  ├─api/
│  │  └─some/route.ts
│  ├─login/
│  │  └─page.tsx
│  └─page.tsx
├─components/
├─hooks/
├─types/
└─proxy.ts (middleware)
```

## 이미지
> `<Image />` 컴포넌트를 사용. 지연로딩, 브라우저 캐싱, 크기 최적화

- `onLoad` 이미지 로딩 완료 시 콜백 (Client Component)
- `quality` 품질 (기본 75)
- `priority` 최적화 (boolean)
- `unoptimized` (기본 false) true:크기 포맷 변경 안함

## Font
> 모든 글꼴 파일에 대한 자체 호스팅 기능 내장

```ts:title=/styles/fonts.ts
import { Roboto } from 'next/font/google';

export const roboto = Roboto({
  subsets: ['latin'], // 사용할 폰트 (영문 글자만 포함된 경량 폰트 로드) 한글 전용 폰트는 보통 subset 구분 없이 전체 로드함
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-roboto',
});
```
### className
```tsx:title=/app/layout.tsx
import { roboto } from '@/styles/fonts';

...
<html lang="ko" className={`h-full ${roboto.className}`}>
```

### variable
```tsx:title=/app/layout.tsx
import { roboto } from '@/styles/fonts';

...
<html lang="ko" className={`h-full ${roboto.variable}`}>
```
```css:title=/styles/global.css
body {
  font-family: var(--font-roboto);
}
```

### 웹폰트
- tailwind.css 설정
```bash
pnpm add pretendard
```
```tsx:title=/app/layout.tsx
import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css'
import '@/styles/global.scss'
```
```css:title=/styles/global.css
:root {
  --font-pretendard:
    'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto,
    'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic',
    'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', sans-serif;
}
@theme inline {
  --font-sans: var(--font-pretendard);
}
@layer base {
  body {
    font-family: var(--font-sans);
  }
}
```

## NextResponse
> Next 13 이상에서 API 라우트 작성 시 사용
- API Route, proxy(middleware)에서 사용
- Cookie get, set

Method              | &nbsp;
:-------------------|:-----------------------------------
`NextResponse.redirect(url)` | URL로 리다이렉트, 반드시 return
`NextResponse.rewrite(url)` | URL 그대로 유지하면서 내부 컨텐츠 변경
`NextResponse.json(data)` | &nbsp;
`NextResponse.cookies.set(name, value)` | &nbsp;
`NextResponse.cookies.get(name)` | &nbsp;

### 사용예시 1. API Route
```ts
import { NextResponse } from 'next/server';

const API_KEY = process.env.SOME_API_KEY;
const BASE_URL = 'Some Api url';

export async function GET(request: Request) {
	const query = new URL(request.url).searchParams.get('Some Api 쿼리');

	if (!query) {
		return NextResponse.json({ error: 'Query is required' }, { status: 400 });
	}
	if (!API_KEY) {
		throw new Error('Api Key Error');
	}

	try {
		const params = new URLSearchParams({
			Some Api 쿼리: query,
			...
			key: API_KEY,
		});
		const res = await fetch(`${BASE_URL}?${params.toString()}`, { next: { revalidate: 3600 } });
		if (!res.ok) {
			return NextResponse.json({ error: 'Api error' }, { status: res.status });
		}
		const data = await res.json();
		return NextResponse.json(data || {});
	} catch (error) {
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
	}
}
```

### 사용예시 2. Supabase 사용자 확인 (proxy에서 redirect 할 때)
- 쿠키 토큰 검사 후 NextResponse 객체 받기
- 로그인 상태에 따른 redirect
```ts:title=src/proxy.ts
import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware'; // supabase user 세션 확인

export async function proxy(request: NextRequest) {
  const { response, user } = await updateSession(request);
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  if (user && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!user && pathname.startsWith('/playlist')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.well-known|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```


* * *
- https://nextjs.org/docs/app/getting-started/project-structure
