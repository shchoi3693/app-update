---
date: '2026-06-13'
title: 'Tanstack Query 사용 가이드'
categories: ['Modern Stack']
summary: 'Tanstack query Next 구성 방법'
thumbnail: './gatsby-starter.jpg'
---

> 서버로부터 데이터 가져오기, 캐싱, 캐싱제어

## Next.js 캐싱과 차이점
&nbsp;   | Next.js | TanStack Query
:--------|:--------|:--------------
&nbsp;   | `fetch(url, {next: revalidate})` | `staleTime`
저장 위치 | Next.js 서버 | 사용자 브라우저 메모리
대상     | 모든 사용자(공용) | 해당 사용자
목적     | 외부 API 호출 횟수 감소 | 불필요한 재요청 감소

## Vite 구성
```tsx
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
      <Example />
    </QueryClientProvider>
  )
}
```

## Next.js 구성 (Server 렌더링)
- `QueryClientProvider` 사용시 전체(layout)를 Client Component로 변환해야하는 문제  
  - Client Component만 사용 시 JS 번들크기 증가, 초기 로딩 속도 저하

### `queryClient` 생성 후 `QueryClientProvider`로 감싸기
```tsx:title=src/providers/TanstackProvider.tsx
'use client';

import { ReactNode } from 'react';
import { environmentManager, QueryClient, QueryClientProvider } from '@tanstack/react-query';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // refetch 방지 위해 0보다 크게
        staleTime: 1000 * 60 * 5,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;
function getQueryClient() {
  if (environmentManager.isServer()) {
    // 서버일 경우 항상 new 생성
    return makeQueryClient();
  } else {
    // new QueryClient 없을 때 생성
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export default function TanstackProvider({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
```
```tsx:title=/app/layout.tsx
import TanstackProvider from '@/providers/TanstackProvider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <TanstackProvider>{children}</TanstackProvider>
      </body>
    </html>
  );
}
```
### Server Component
```tsx:title=/page.tsx
export default async function Example() {
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Posts />
    </HydrationBoundary>
  )
}
```
### Client Component
- Server Component 에서 `prefetchQuery` 했다면 `useQuery`(같은 `queryKey`) 어디든(server, client) 사용 가능
```tsx:title=/page.tsx
'use client'
export default function Posts() {
  const { data } = useQuery({
    queryKey: ['posts'], // prefetch한 데이터
    queryFn: () => getPosts(),
  })

  const { data: commentsData } = useQuery({
    queryKey: ['posts-comments'], // 나중에 보여도 되는 데이터
    queryFn: getComments,
  })
	...
}
```
- Server prefetch : 중요하거나 화면에 먼저 보여야하는 데이터 (SEO 향상, 게시글 본문)
- Client : 유저 상호작용 데이터 (댓글 목록, 추천 상품)

## prefetchQuery
- queryClient에 직접 호출하는 비동기 매서드
- 호출 즉시 데이터 캐시(리렌더링 없이), Promise 반환 (await)
- 데이터 사용하려면 `useQuery`나 `useSuspenseQuery` 사용

## HydrationBoundary
- `dehydrate` 함수를 사용해 직렬화 : `queryClient` 상태를 JSON으로 직렬화 후  
&rightarrow; 클라이언트(`<HydrationBoundary>` state props)에 전달, 클라이언트에서 복원

## useQuery
> 기본 쿼리 훅
- 컴포넌트에서 데이터 가져올 때 사용

```ts
const someReturn = useQuery(옵션)
```
```ts
export const useSome = (query:string)=>{
	return useQuery({
		queryKey: ['데이터 키', query],
		queryFn: ()=>{
			const res = await fetch(`/someApi?t=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('Search error');
      return res.json();
		},
		enabled: !!query,
    staleTime: 1000 * 60 * 10,
	})
}
```
- `queryKey` 고유 쿼리 키 (필수 옵션)
```ts
// 단순 목록
queryKey:['데이터 키']
// 특정 유저 목록
queryKey:['데이터 키', userId]
// 특정 유저 + 상세
queryKey:['데이터 키', userId, trackId]
```
- `queryFn` 데이터 반환, 오류 (필수 옵션)
- `enabled` 쿼리 자동 실행 여부
- `staleTime` 데이터 stale 시간(ms)

### useQuery 방식 사용 예시 (Client Component)
```tsx
const { data: someData, isPending, isError} = useSomeData();
const { mutate: addData, isPending: isAddDataPending, isError: addDataError } = useAddData();

if (isPending) return <>Data Loading</>;
if (!someData || someData.length === 0) return <>Data 0</>;
if (isAddDataPending) return <>데이터 추가할 때 Loading</>;
if (isError || addDataError) return <>Error</>;

const handler = (data) =>{
	addData(data)
}
```

## useSuspenseQuery, QueryErrorResetBoundary
- Loading, Error를 트리 레벨에서 한 번에 관리 (직관적)  
  - Pendign : throw &rightarrow; 가장 가까운 `<Suspense>`(React) fallback이 Loading
  - 에러 : throw &rightarrow; `<ErrorBoundary>`(React) 이 catch

### Suspense (React)
- React에서 컴포넌트가 비동기 작업을 수행하는 동안 로딩 상태 관리하는 기능
- Suspense 컴포넌트 사용 (status 지정) &rightarrow; Tanstack Query의 suspense옵션 활성화

### ErrorBoundary (React)
- React에서 컴포넌트 트리 내의 오류를 잡아내 대체 UI 표시

### React 사용 예시
```tsx
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
    },
  },
});

const ErrorFallback = ({error}) => (
  <div>{error.message}</div>
)

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<Loading />}>
        <Example />
      </Suspense>
    </ErrorBoundary>
  </QueryClientProvider>
)
```

### Next.js (App Router) 사용 예시
```tsx
export default async function Home() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(trackQueries.mainPlaylist());
  /*
  await queryClient.prefetchQuery({
    queryKey: trackKeys.mainPlaylist(),
    queryFn: () => trackService.getMainPlaylistTracks(),
  });
  */

  return (
    <main className="flex w-full max-w-3xl flex-1 flex-col">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <QueryAsyncBoundary pendingFallback={<Skeleton />}>
          <MainBnr />
        </QueryAsyncBoundary>
      </HydrationBoundary>
      <Link href="/login">Login</Link>
    </main>
  );
}
```
```tsx:title=src/component/QueryAsyncBoundary.tsx
'use client';

import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ReactNode, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
interface AsyncBoundaryProps {
  children: ReactNode;
  pendingFallback: ReactNode;
}
export default function QueryAsyncBoundary({ children, pendingFallback }: AsyncBoundaryProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <div>
              에러가 발생했습니다.
              <button onClick={resetErrorBoundary}>다시 시도</button>
            </div>
          )}
        >
          <Suspense fallback={pendingFallback}>{children}</Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
```
```tsx:title=MainBnr.tsx
...
const { data } = useSuspenseQuery(trackQueries.mainPlaylist());
...
```

## useMutation
> 데이터 변경작업

- 성공, 실패, 로딩 상태
- 요청 실패 시 자동 재시도, 데이터 Placeholder (Optimistic Update)

```ts
const queryClient = useQueryClient();
// 기존 캐시 무효화 -> 새로 가져오기
return useMutation({
	mutationFn: async (data)=> {
		...
	},
	onError:(error: any) => error,
	onSuccess: ()=>{
		queryClient.invalidateQueries({ queryKey: ['데이터 키 1', '데이터 키 2'] });
		queryClient.invalidateQueries({ queryKey: ['데이터 키 1'] });
	}
})
```
- `mutationFn` 실행할 비동기 변이 함수 (필수 옵션)
- `onSuccess` 변이 성공 후 호출


## Skeleton 처리
- `isLoading` 또는 Suspense로 처리

&nbsp; | &nbsp; | &nbsp;
:------------|:----------------------|:--------------
`isFetcing` | API요청 진행 중            | 데이터 그대로 둔 채 데이터 업데이트
`isPending` | 캐시 없음                  | 데이터 추가/수정 (저장 중)
`isLoading` | `isFetcing` + `isPending` | 초기 화면
