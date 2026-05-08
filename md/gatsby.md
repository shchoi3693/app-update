---
date: '2026-04-30'
title: 'gatsby'
categories: ['Design']
summary: ''
thumbnail: './img1.jpg'
---


## Circle Percent

<script>
const dataDashboard = [
	{ category: "FERT", code: "MR-1022610", state: "Approved", name: "DESC-L-054/DRUM/254KG", pct: 80, manager: "Maya Sakamoto", date: "2025-12-24", time: "10:00 AM" },
	{ category: "FERT", code: "MR-1022611", state: "Approved", name: "DESC-L-054/DRUM/254KG", pct: 50, manager: "Maya Sakamoto", date: "2025-12-24", time: "11:30 AM" },
	{ category: "FERT", code: "MR-1022612", state: "In progress", name: "POL-Y-022/BAG/25KG", pct: 70, manager: "Kenji Sato", date: "2026-01-05", time: "09:15 AM" },
	{ category: "FERT", code: "MR-1022613", state: "Rejected", name: "CHEM-X-101/IBC/1000L", pct: 10, manager: "Maya Sakamoto", date: "2026-01-10", time: "02:45 PM" },
	{ category: "ROH", code: "MR-1022614", state: "In progress", name: "DESC-L-054/DRUM/254KG", pct: 45, manager: "Elena Rodriguez", date: "2026-01-15", time: "10:00 AM" },
	{ category: "ROH", code: "MR-1022615", state: "Approved", name: "ACID-K-300/DRUM/200KG", pct: 100, manager: "Maya Sakamoto", date: "2026-01-20", time: "08:30 AM" },
	{ category: "ROH", code: "MR-1022617", state: "Approved", name: "DESC-L-054/DRUM/254KG", pct: 40, manager: "Elena Rodriguez", date: "2026-02-01", time: "09:05 AM" },
	{ category: "VERP", code: "MR-1022618", state: "In progress", name: "SOLV-S-900/TANK/5000L", pct: 65, manager: "Maya Sakamoto", date: "2026-02-03", time: "11:00 AM" },
	{ category: "VERP", code: "MR-1022619", state: "Rejected", name: "POL-Y-022/BAG/25KG", pct: 30, manager: "Kenji Sato", date: "2026-02-05", time: "01:15 PM" },
	{ category: "VERP", code: "MR-1022620", state: "Approved", name: "DESC-L-054/DRUM/254KG", pct: 78, manager: "Maya Sakamoto", date: "2026-02-10", time: "10:45 AM" },
	{ category: "VERP", code: "MR-1022622", state: "In progress", name: "ACID-K-300/DRUM/200KG", pct: 85, manager: "Maya Sakamoto", date: "2026-02-15", time: "09:50 AM" },
	{ category: "INT", code: "MR-1022625", state: "Rejected", name: "SOLV-S-900/TANK/5000L", pct: 5, manager: "Maya Sakamoto", date: "2026-02-22", time: "04:55 PM" }
]
const dataCountByState = dataDashboard.reduce((acc, current)=>{
	acc[current.state] = (acc[current.state] || 0) + 1;
	return acc;
}, {})
const dataProgress = [
	{label: "In Progress", value: dataCountByState["In progress"], color: "#3174D1"},
	{label: "Approved", value: dataCountByState["Approved"], color: "#DFA120"},
	{label: "Rejected", value: dataCountByState["Rejected"], color: "#BA4038"},
];
const totalSum = dataProgress.reduce((acc, item) => acc + item.value, 0);
let accPercent = 0;
const doughnutChart = dataProgress.reduce((acc, item)=>{
	const percent = Number(((item.value / totalSum) * 100).toFixed(2));
	const offset = -accPercent;
	accPercent += percent;
	return acc + `
		<circle r="60" cx="50%" cy="50%"
			stroke="${item.color}"
			fill="none"
			stroke-width="6"
			stroke-linecap="round"
			pathLength="100"
			stroke-dasharray="${percent} 100"
			stroke-dashoffset="${offset}">
		</circle>`;
},"")
const centerText = `
	<text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" >
		<tspan x="50%" dy="-0.2em" style="font-size:30px;font-weight:500;">${totalSum}</tspan>
		<tspan x="50%" dy="1.6em" style="font-size:16px;">TOTAL</tspan>
	</text>
`;
document.querySelector('.doughnut_chart svg').innerHTML = doughnutChart + centerText;
</script>

## 제품의 사용자 경험 증진 internal tool that helps software

1. 사용자 피드백 활성화
2. 사용자 신뢰도 측정
3. 사용자 커스텀

## 미드저니

```
prop --param
```

- `--ar` : 종횡비 `--ar 16:9` `--ar 4:5`(인스타)
- `--no` : 제외 키워드 `--no text, blurry, distorted` (텍스트 흐릿함 방지)
- `--v 6.0` : 모델 버전
- `--stylize` : 미드저니 예술성 `--s 0` ~ `--s 1000` 높을수록 창의성
- `--weirdness` : 실험적 `--w 0` ~ `--w 3000` 높을수록 창의적
- `--variety` : 4컷 결과 다름 `--v 0` ~ `--v 100` 높을수록 다양한 결과

## 전문성 평가, 개선

`현재 사이트가 구식으로 보이는 요소들을 레이아웃, 컬러팔레트, 타이포그래피, 인터렉션, 콘텐츠 구성 측면에서 진단해줘. 이와 비슷한 2026년 웹 트렌드 디자인 특징 5가지와 비교해서 갭을 분석해봐.`

## Contentful

> Headless CMS(Content Management System)

- 컨텐츠를 저장하고 관리하는 백엔드 기능만 제공



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
