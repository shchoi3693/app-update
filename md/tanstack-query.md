---
date: '2026-05-06'
title: 'TanStack Query'
categories: ['Modern Stack']
summary: 'css, css trick'
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

## 반환
- 컴포넌트에서 사용
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

