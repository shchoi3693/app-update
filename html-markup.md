---
date: '2026-04-21'
title: 'HTML Markup'
categories: ['Web Fundamentals']
summary: 'HTML Markup 외 Snippet, Utility 모음'
thumbnail: './gatsby-starter.jpg'
---

## dialog (HTML Element)
> 모달/비모달(팝업, 모달, 알림창) 상자를 표준적이고 접근성있게 구현  
> JavaScript 사용하여 제어

methods | &nbsp; | &nbsp;
:------|:------|:------
`dialog.showModal()`  | 모달 열기 | 최상위 레이어에 배치 <br /> ESC 키 닫기 <br /> ::backdrop 가상요소
`dialog.show()`       | 비모달 열기 | ::backdrop 가상 요소가 없어 다른 요소와 상호작용
`dialog.close()`  | 모달/비모달 닫기 | &nbsp;

CSS features | &nbsp;
:-------|:------
(모달)::backdrop | 바로 뒤 전체 화면
[@starting-style](/css-features/#starting-style) | 애니메이션 전환

```html
<button onclick="openModal()">open</button>
<dialog id="myModal">
	<div class="modal-content">Contents</div>
</dialog>
```
```css
dialog {
	/* Exit State */
	transform: translateY(20px);
	opacity: 0;
	transition:
		transform 0.3s,
		opacity 0.3s,
		display 0.3s allow-discrete,
		overlay 0.3s allow-discrete;
}
/* Open State */
dialog[open] {
	transform: translateY(0);
	opacity: 1;

	/* Before-Open State */
	@starting-style {
		transform: translateY(20px);
		opacity: 0;
	}
}
```
```js
function openModal() {
	document.querySelector('#myModal').showModal()
}
```


## popover (HTML Attribute)
> JavaScript 없이 css만으로 툴팁, 드롭다운, 모달 구현 가능
- Top Layer 자동 처리 (복잡한 z-index 해결)
- 접근성 자동 처리
- 모달 접근성은 [`<dialog>`](#dialog) 가 더 적합(tab focus)

```html
<button popovertarget="my-popover">열기</button>
<div id="my-popover" popover>내용</div>
```
- `popovertarget` : `<buttom>`, `<input>` 요소로 popover 제어 (제어할 popover id값 받음)  
	이 외 태그로(div, a) 사용하려면 JavaScript로 제어하며, 접근성 등 직접 처리해야함
- `popovertargetaction` : popover 제어 요소에 작업 지정 (`show` `hide` `toggle`)

popover Values | &nbsp; | 사용 예
:-------|:------|:------
auto (default) <br/> `popover="auto"` <br /> === `popover` <br /> === `popover=""` | 외부 클릭 닫기, ESC 닫기 가능(light-dismissed) | 툴팁, 드롭다운, 유저 프로필
manual | JavaScript로 닫기 제어 | toast 알림
hint <span class="badge-danger">실험적</span> | hint open 시 auto 닫지 않음 <br /> 실험단계로 기능 구현 잘 안됨 | &nbsp; 

popover CSS features | &nbsp;
:-------|:------
::backdrop | 바로 뒤 전체 화면
:popover-open | popover open 될 때 스타일
[@starting-style](/css-features/#starting-style) | 애니메이션 전환

popover Methods | &nbsp;
:-------|:------
`HTMLElement.hidePopover` | 숨긴 후 display:none
`HTMLElement.showPopover` | 최상위 레이어에 추가
`HTMLElement.togglePopover` | 현재 상태 반전 `HTMLElement.togglePopover(boolean)`

### Toast Popover
```html
<button onclick="createToast('name', '저장', '완료되었습니다.')">Trigger</button>
<div id="toast-container"></div>
```

```css
[popover] {
	position: absolute;
	inset: unset;
	right: 20px;
	padding: 12px 20px;
	border: 1px solid #ddd;

	/* Exit State */
	transform: translateY(20px); 
	opacity: 0;
	transition:
		opacity 0.3s,
		transform 0.3s,
		bottom 0.3s,
		display 0.3s allow-discrete,
		overlay 0.3s allow-discrete;
}
/* Open State */
[popover]:popover-open {
	transform: translateY(0);
	opacity: 1;
	
	/* Before-Open State */
	@starting-style {
		transform: translateY(20px);
		opacity: 0;
	}
}
```

```javascript
const createToast = (name, title, msg) => {
	const popover = document.createElement('div')
	popover.popover = 'manual'
	popover.classList.add('toast')
	popover.textContent = msg
	document.body.appendChild(popover)

	popover.showPopover()
	moveToast()

	setTimeout(() => {
		popover.hidePopover()
		setTimeout(() => {
			popover.remove() // Exit State 후(transition) 삭제
			moveToast()
		}, 500)
	}, 4000)
}

const moveToast = () => {
	const toasts = document.querySelectorAll('.toast:popover-open')
	const margin = 10
	const initialBottom = 20

	toasts.forEach((toast, i) => {
		const toastHeight = parseInt(toast.offsetHeight) || 0
		toast.style.bottom = `${initialBottom + i * (toastHeight + margin)}px`
	})
}
```

### ToggleEvent: newState
> `<popover>` 요소가 전환되는 상태 String (`<details>` 도 사용가능)

```js
popover.addEventListener('toggle', (event) => { // 또는 beforetoggle (데이터 불러올 때)
	// event.newState === "open" | "closed"
})
```

### OG Tag
```html
<meta property="twitter:title" content="">
<meta property="twitter:description" content="">
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:image" content="_share_main.png">
<meta property="twitter:image:width" content="500">
<meta property="twitter:image:height" content="250">
<meta property="og:title" content=""/>
<meta property="og:description" content="">
<meta property="og:image" content="_share_main.png">
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:site_name" content="사이트 명">
<meta property="og:type" content="website">
<meta property="og:url" content="url">
```

## Event Resize, Scroll 최적화
### Debounce
- 마지막 호출, delay 후 실행 : 이벤트 하나로 묶어 처리
- 실시간 검색, 검색 필터링, 창 크기 조정, 유효성 검사
```js
const debounce = (cb: Function, delay) => {
	let timer = null;

	return function (...args) {
		if (timer) clearTimeout(timer);

		timer = setTimeout(() => {
			cb.apply(this, args)
			timer = null;
		}, delay);
	}
}
```
### Throttler
- delay 마다 실행 : 이벤트 중에도 delay 마다 업데이트
- 스크롤, API 호출
```js
const throttler = (cb: Function, delay) => {
	let timer = null;

	return function (...args) {
		if (!timer) {
			cb.apply(this, args);

			timer = setTimeout(() => {
				timer = null;
			}, delay);
		}
	}
};
```

## Utility
### Radio Readonly
```js
someRadio.forEach(item=>{
	item.addEventListener('click', e=> e.preventDefault())
})
```

### 제한시간 타이머
```js
const createCountdown = (limitTime) =>{
	const displayElement = document.querySelector('.printTime');
	if (!displayElement) return;

	let tickSetTimeout;
	const numericLimit = Number(limitTime) || 0;
	const endTime = Date.now() + (numericLimit * 1000);

	const render = (time) =>{
		const min = String(Math.floor(time/60)).padStart(2, "0");
		const sec = String(time % 60).padStart(2, "0");
		const timeStr = min + sec;
		const timeHtml = timeStr.split('')
			.map(val => `<span class="inp">${val}</span>`)
			.join('');

		displayElement.innerHTML = timeHtml;
	}

	const tick = ()=>{
		const syncTime = endTime - Date.now();
		const remainingTime = Math.max(0, Math.ceil(syncTime / 1000));
		const nextDelay = syncTime % 1000 || 1000;

		render(remainingTime);

		if (remainingTime <= 0) {
			clearTimeout(tickSetTimeout);
			return
		}
		
		tickSetTimeout = setTimeout(tick, nextDelay);
	}
	tick();

	return {
		stop: () => clearTimeout(tickSetTimeout)
	}
}
```
