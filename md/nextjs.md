---
date: '2026-06-05'
title: 'Next 16'
categories: ['Design']
summary: ''
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

## 이미지
> `<Image />` 컴포넌트를 사용. 지연로딩, 브라우저 캐싱, 크기 최적화

- `onLoad` 이미지 로딩 완료 시 콜백 (Client Component)
- `quality` 품질 (기본 75)
- `priority` 최적화 (boolean)
- `unoptimized` (기본 false) true:크기 포맷 변경 안함