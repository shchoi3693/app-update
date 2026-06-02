---
date: '2026-05-06'
title: 'Zustand'
categories: ['Visual UI']
summary: 'css, css trick'
thumbnail: './gatsby-starter.jpg'
---

> 전역 상태 관리(Store) 라이브러리 : 여러 상태를 중앙에서 관리하는 패턴
- Hooks 기반으로 작동
- 다크모드, 모달 상태, 장바구니 임시저장

```
pnpm add zustand
```

- `create` 함수로 스토어 생성
- `get` `set` 매개변수, `set` 콜백 함수 사용 시 `get` 사용하지 않아도 됨

```ts
interface Some {
  someId: string | null;
  setSomeId: (id: string | null) => void;
}
export const useSomeStore = create<Some>((set, get)=>{
	return{
		someId: 초기값,
		setSomeId: id => set({ someId: id })
	}
})
```
```ts
export default function SomeComponent() {
	const {someId, setSomeId} = useSomeStore();
}
```

## Turntable 전역 상태관리

