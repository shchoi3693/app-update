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



## Supabase Auth UI
> 로그인 라이브러리

```bash
pnpm add @supabase/auth-ui-react @supabase/auth-ui-shared
```

```tsx
// 확인
supabase.auth.getSession();
// 로그아웃
supabase.auth.signOut();
```
```tsx
<Auth
	supabaseClient={supabase}
	appearance={테마}
	// 로그인 방식
	providers={['google', 'github']}
	// Label
	localization={{
		variables: {
			sign_in: {
				email_label: '이메일 주소',
				password_label: '비밀번호',
				button_label: '로그인하기',
			},
			sign_up: {
				button_label: '회원가입하기',
			}
		}
	}}

>
```

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



### Zustand 전역 상태 관리

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

import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/useAuthStore';
import { ReactNode, useEffect } from 'react';

export default function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = createClient();
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
    });
    return () => subscription.unsubscribe();
  }, [setUserId, supabase]);

  return <>{children}</>;
}
```

