---
date: '2026-05-06'
title: 'Typescript'
categories: ['Web Fundamentals']
summary: 'css, css trick'
thumbnail: './gatsby-starter.jpg'
---

### 타입 key값으로 추출
```js
export type NAME = (typeof 배열)[number]['name'];
export type NAME = keyof typeof 객체
```

## as / is
### as (Type Assertion 타입 단언)
- 컴파일 단계에서 타입스크립트가 감지하지 못하는 특정 변수에 대한 타입 **명확히** 명시

```ts
// expr: string, T: number
const a = expr as any as T
```
number 타입으로 억지로 바꾸고 싶을 때 두 번 써서 변경 가능

### is (Type Guard)
- 한정된 범위 내의 모든 변수에 대해 일괄적으로 적용

```ts
function isString(someTest: any): someTest is string {
  return someTest === 'string'
}
```

## useRef
### userState와 비교
| useState               | useRef                                      |
| :--------------------- | :------------------------------------------ |
| 값이 변경되면 리렌더링 | 값이 바뀌어도 리렌더링 하지않음 (값만 바뀜) |

#### useRef 사용하는 곳
1. DOM 직접 변경
- focus, 스크롤 위치 계산, 외부 라이브러리 연결

```ts
const inputRef = useRef<HTMLInputElement>(null)
const handlSomeElement = () => {
  inputRef.current?.focus() // 실제 DOM Element
}

return <input ref={inputRef} />
```

2. 변수 관리
- setTimeout