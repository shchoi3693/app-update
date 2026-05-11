---
date: '2026-05-06'
title: 'TanStack Query'
categories: ['Visual UI']
summary: 'css, css trick'
thumbnail: './gatsby-starter.jpg'
---

> 서버로부터 데이터 가져오기, 캐싱, 캐싱제어

## useMutation
> 데이터 변경작업

- 성공, 실패, 로딩 상태
- 요청 실패 시 자동 재시도, 데이터 Placeholder (Optimistic Update)





```tsx
// 단순 목록
queryKey:['데이터 키']
// 특정 유저 목록
queryKey:['데이터 키', userId]
// 특정 유저 + 상세
queryKey:['데이터 키', userId, trackId]
// 기존 캐시 무효화 -> 새로 가져옴
invalidateQueries[]
```
