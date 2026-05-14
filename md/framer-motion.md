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
- `initial` 애니메이션 초기 상태 (마운트 시점)
- `animate` 애니메이션 끝난 상태
- `transition` 애니메이션 진행 모습 (linear, easeInOut, circInOut ...)

```ts
<motion.div
	className="w-20 h-20 bg-amber-100"
	initial={{ x: 40, y: 40, rotate: 45 }}
	animate={{ x: 60, y: 60, rotate: 0 }}
	transition={{ ease: 'circInOut', duration: 1 }}
></motion.div>
```

## 변수
> 인라인 정의 시 읽기 어렵고 복잡함 &rightarrow; 변수로 정의  
> 동적으로 사용 가능

```ts
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
```ts
const x = useMotionValue(0)
const opacity = useTransform(x, input, output)
// x 의 input 상태 감지, opacity 상태를 x 상태에 맵핑하여 output 으로 정의
```

```ts
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
```ts
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
		<motion.span></motion.span>
		<motion.span></motion.span>
		<motion.span></motion.span>
	</motion.div>
)
```

### Modal 팝업
```ts
<AnimatePresence>
	{isOpen && (
		<motion.div // 모달 팝업 Wrapper
			initial={{ y: 80, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			exit={{ y: 80, opacity: 0 }}
			transition={{ ease: 'circInOut', duration: 1 }}
		></motion.div>
	)}
</AnimatePresence>
```

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

