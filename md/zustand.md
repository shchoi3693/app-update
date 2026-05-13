---
date: '2026-05-06'
title: 'Zustand'
categories: ['Visual UI']
summary: 'css, css trick'
thumbnail: './gatsby-starter.jpg'
---

> 전역 상태 관리(Store) 라이브러리 : 여러 상태를 중앙에서 관리하는 패턴
- Hooks 기반으로 작동

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
export default function SomeComponent() {
	const {someId, setSomeId} = useSomeStore();
}
```

## Supabase Auth 전역 관리
```ts:title=src/store/useAuthStore.ts
import { create } from 'zustand';

interface AuthState {
  userId: string | null;
  setUserId: (id: string | null) => void;
}

export const useAuthStore = create<AuthState>(set => ({
  userId: null,
  setUserId: id => set({ userId: id }),
}));
```
```tsx:title=src/providers/AuthProvider.tsx
'use client';

import { ReactNode, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/useAuthStore';

export default function AuthProvider({ children }: { children: ReactNode }) {
  /** const supabase = createClient();
	 * 최상위 컨텍스트(provider), 컴포넌트 안에 있을경우 useEffect 사용
	 * 하위 컴포넌트의 불필요한 리렌더링 방지 - 처음 마운트 될 때 한번만 실행
	 */
	const [supabase] = useState(() => createClient()); 
  const { setUserId } = useAuthStore();
  useEffect(() => {
    const initUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    initUser();

    // Auth 상태 변화 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUserId(session?.user?.id || null);

			switch (event) {
				case 'SIGNED_IN':
					break;
				case 'SIGNED_OUT':
					break;
			}
    });
    return () => subscription.unsubscribe();
  }, [setUserId, supabase]);

  return <>{children}</>;
}
```
```tsx:title=layout.tsx
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <TanstackProvider>
          <AuthProvider>{children}</AuthProvider>
        </TanstackProvider>
      </body>
    </html>
  );
}
```

