---
date: '2026-04-30'
title: 'Framer Motion'
categories: ['Design']
summary: ''
thumbnail: './img1.jpg'
---

> React 기반 애니메이션 라이브러리

## Framer Componenet
- 모든 HTML 및 SVG 요소
- `<motion.div>` `<motion.span>` `<motion.circle>`

## 애니메이션 구조
- 애니메이션 초기 상태 (마운트 시점)
- 애니메이션 끝난 상태
- 애니메이션 진행 모습

## Props
### Animation
- `initial` 애니메이션 초기 상태 (마운트 시점)
- `animate` 애니메이션 끝난 상태
- `transition` 애니메이션 진행 모습 (linear, easeInOut, circInOut ...)
```tsx
<motion.div
	className="w-20 h-20 bg-amber-100"
	initial={{ x: 40, y: 40, rotate: 45 }}
	animate={{ x: 60, y: 60, rotate: 0 }}
	transition={{ ease: 'circInOut', duration: 1 }}
/>
```
- `exit` 트리에서 제거될 때 상태  
	- `<AnimatePresence>` 의 직계 자식이어야만 애니메이션 활성화
```tsx
<AnimatePresence>
	{isVisible &&(
		<motion.div
			...
			exit={{ opacity:0 }}
		/>
	)}
</AnimatePresence>
```

### Hover, Tap(click/touch)
- `whileHover`
- `onHoverStart` `onHoverEnd` 마우스 오버 콜백 함수
- `whileTab` click/touch
- `onTapStart` `onTap` `onTapCancel` Tap 콜백 함수

### Pan
> 제스처 인식될 때 콜백 함수  
> 터치 디바이스 환경에서 사용 시 터치 비활성화 `touch-action:none`

- `onPan` `onPanStart` `onPanEnd`
```tsx
<motion.div onPan={(event, info)=> info.point.x} />
```
- `point` 페이지 기준 좌표
- `delta` 마지막 이벤트 후 거리
- `offset` 이벤트 발생 지점과의 거리
- `velocity` 포인터 속도

### 변수
- 인라인 정의 시 읽기 어렵고 복잡함 &rightarrow; 변수로 정의  
- 동적으로 사용 가능

```tsx
const AniButton = () => {
	const [isClicked, setIsClicked] = useState(false);

	const buttonVariants = {
		reset: {
			scale: 1,
		},
		hover: (isClicked)=> ({ // 동적 사용
			scale: isClicked ? 1 : 1.5,
		}),
		pressed: {
			scales: 0.5,
		},
	}

	return(
		<motion.button
			initial="reset"
			whileHover="hover"
			whileTab="pressed"
			variants={buttonVariants}
			custom={isClicked}
			onClick{() => setIsClicked(true)}
		>
			Click
		</motion.button>
	)
}
```

## Motion Values
> 애니메이션 상태와 속도 추적

- MotionValue 생성 후 inline 스타일에 정의
- `useMotionValue` : MotionValue 정의 (style 속성명과 일치시키는게 관례)
- `useTransform` : 다른 MotionValue로 변환, 맵핑
```tsx
const x = useMotionValue(0)
const opacity = useTransform(x, input, output)
// x 의 input 상태 감지, opacity 상태를 x 상태에 맵핑하여 output 으로 정의
```
```tsx
const aniBox = {
	initial: {
		scale: 0,
	},
	animate: {
		scale: 1
	},
};

const scale = useMotionValue(0);
const rotate = useTransform(scale, [0.9, 1], [0, 90])
return(
	<>
		<motion.div
			style={{ scale, rotate }}
			variants={aniBox}
			initial="initial"
			animate="animate"
			transition={{ ease: "circInOut", duration: 2 }}
		>
		</motion.div>
	</>
)
```

## Delay
```tsx
const aniParent = {
	animate:{
		...
		transition:{
			duration:0.5,
			delayChildren: 2, // Children element animation 딜레이
			staggerChildren: 0.2, // 딜레이 후 다음 형제 element 딜레이
		}
	}
}
return (
	<motion.div
		variants={aniParent}
		...
		animate="animate"
	>
		<motion.span />
		<motion.span />
		<motion.span />
	</motion.div>
)
```

## Drag
- `dragConstraints` 드래그 영역 제약
```tsx
<motion.div drag dragConstraints={{ left:0, right:0}} />
```
```tsx
const MyComponent = () => {
  const constraintsRef = useRef(null)

  return (
     <motion.div ref={constraintsRef}> // ref 로 지정
         <motion.div drag dragConstraints={constraintsRef} />
     </motion.div>
  )
}
```
- `dragSnapToOrigin` 원상태로 돌아가기
- `dragElastic` 드래그 영역 밖 움직임 정도 (default: 0.5)


## Motion.js
> 바닐라 JavaScript 환경에서 사용하기

```js
<script src="https://cdn.jsdelivr.net/npm/motion@latest/dist/motion.js"></script>
<script>
  const { animate, scroll } = Motion
</script>
```

```js
animate("선택자", {애니메이션})
```

### Modal 팝업 구현
```js
const modal = document.querySelector('#myModal')
if(isOpen){
	animate(
		modal,
		{
			y: [80, 0],
			opacity: [0, 1],
			scale: [0.8, 1],
		},
		{ duration: 1, ease: 'circInOut' },
	)
} else {
	const animation = animate(
		modal,
		{
			y: 80,
			opacity: 0,
			scale: 0.8,
		},
		{ duration: 1, ease: 'circInOut' },
	)
	await animation.finished
	if (!isOpen) {
		modal.style.display = 'none'
	}
}
```

* * *
[Framer 튜토리얼](https://blog.maximeheckel.com/posts/guide-animations-spark-joy-framer-motion/)  
[Framer Motion 예제](https://motion.dev/examples)
