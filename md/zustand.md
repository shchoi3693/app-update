---
date: '2026-06-13'
title: 'Zustand'
categories: ['Modern Stack']
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
### 스토어 생성
```ts:title=src/store/usePlayerStore.ts
import { PlaylistTrack } from '@/types/playlist';
import { create } from 'zustand';

interface PlayerState {
	activeTrack: PlaylistTrack | null;
	setActiveTrack: (track: PlaylistTrack | null) => void;
}

export const usePlayerStore = create<PlayerState>(set => ({
	activeTrack: null,
	setActiveTrack: track => set({ activeTrack: track }),
}))
```
### Client 사용
- 불필요한 리렌더링 방지
```tsx
const activeTrack = usePlayerStore(state => state.activeTrack);
const setActiveTrack = usePlayerStore(state => state.setActiveTrack);
```
- 다중 상태 `useShallow`
```tsx
const playerState = usePlayerStore(
	useShallow(state => ({
		activeTrack: state.activeTrack,
		setActiveTrack: state.setActiveTrack,
	})),
);
...
<p>{playerState.activeTrack.id}</p>
<button onClick={() => playerState.setActiveTrack(null)} />
```



