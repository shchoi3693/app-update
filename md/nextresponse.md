---
date: '2026-05-06'
title: 'Supabase'
categories: ['Visual UI']
summary: 'css, css trick'
thumbnail: './gatsby-starter.jpg'
---

> Next 13 이상에서 API 라우트 작성 시 사용

- API Route, middleware 에서 사용
- Cookie get, set

Method              | &nbsp;
:-------------------|:-----------------------------------
`NextResponse.redirect(url)` | URL로 리다이렉트, 반드시 return
`NextResponse.rewrite(url)` | URL 그대로 유지하면서 내부 컨텐츠 변경
`NextResponse.json(data)` | &nbsp;
`NextResponse.cookies.set(name, value)` | &nbsp;
`NextResponse.cookies.get(name)` | &nbsp;

## 사용예시
### API Route
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

## Supabase 사용자 확인 (middleware에서 redirect 할 때)
- 쿠키 토큰 검사 후 NextResponse 객체 받기
- 로그인 상태에 따른 redirect
```ts:title=src/middleware.ts
import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware'; // supabase user 세션 확인 middleware

export async function middleware(request: NextRequest) {
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



