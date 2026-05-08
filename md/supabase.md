---
date: '2026-05-06'
title: 'Supabase'
categories: ['Visual UI']
summary: 'css, css trick'
thumbnail: './gatsby-starter.jpg'
---

## 설정 Next 16(App Router)
```bash
pnpm add @supabase/ssr @supabase/supabase-js
```
### lib/supabase 파일 분리
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
- `NEXT_PUBLIC_` : 클라이언트 컴포넌트에서도 접근

## 스키마
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
`.select('column1, column2)` | 지정된 테이블의 column 선택 <br /> `.select(*)` 모든 column 선택
`.eq('column', 'value')` | 지정한 값과 일치하는 데이터만 필터링
`single()` | 결과 배열에서 객체 추출 <br /> 데이터 1 (0 이거나 2이상 에러)
`maybeSingle()` | 데이터 0 또는 1 (2이상 에러) : 존재 여부 확인

