---
date: '2025-09-26'
title: 'Web APIs'
categories: ['Web Fundamentals']
summary: 'DOM 요소, Javascript'
thumbnail: './gatsby-starter.jpg'
---

> 웹 앱, 웹 사이트 만들 때 사용할 수 있는 모든 객체 유형  
> 보통 [JavaScript](#javascript)와 함께 사용

## DOM 상속 구조
> [EventTarget] &leftarrow; [Node] &leftarrow; [Element] &leftarrow; [HTMLElement]

> [EventTarget] &leftarrow; [Node] &leftarrow; [DocumentType] [CharacterData(Text)]

> [EventTarget] &leftarrow; [Window]

## DOM 요소 추가
Properties | &nbsp; | &nbsp;
:---|:---|:---
textContent | `Node.textContent = string` | 모든 콘텐츠 (script, style)
innerHTML | `Element.innerHTML = htmlString` | HTML,XML 마크업 &rightarrow; XSS 공격 위험
innerText | `HTMLElement.innerText = string` | hidden 요소 제외 &rightarrow; reflow발생

Methods | &nbsp; | &nbsp;
:---|:---|:---
appendChild | `Node.appendChild(Node)` | 하나의 Node 객체를 자식노드 맨 뒤에 추가 <br /> return 반환
append | `Element.append(Node, String)` | 하나 이상의 Node 객체 또는 String 객체를 <br /> 자식노드 맨 뒤에 추가
prepend | `Element.prepend(Node, String)` | 하나 이상의 Node 객체 또는 String 객체를 <br /> 자식노드 맨 앞에 추가

## Shadow DOM 만들기
### ShadowRoot
> [EventTarget] &leftarrow; [Node] &leftarrow; [DocumentFragment] &leftarrow; [ShadowRoot]
```js
element.attachShadow({ mode: 'open' });
```
- Shadow Host : attach한 DOM 요소
- Shadow Tree : Shadow DOM 내부 트리
- Shadow Root : Shadow Tree의 root node

### host CSS 
- 성능 향상을 위해 :host CSS 컨테이너 사용

```js
constructor(){
	super()
	const shadowRoot = this.attachShadow({ mode: 'open' });
	shadowRoot.innerHTML = `
		<style>
			:host{color:#000}
			:host(.class){color:#000}
		</style>
	`
}
```

### 닫힌 루트 `{mode: 'close'}`
- 사용 지양 (보안 기능이 아님)


## 사용자 정의 요소 (Custom Elements API)
> 캡슐화, CustomElementRegistry 객체

```js:title=pupup-components.js
class myPopup extends HTMLElement{
	connectedCallback(){
		this.innerHTML = `<div>팝업!</div>`
	}
}
customElements.define('my-popup', myPopup);

// Or 익명 클래스 (anonymous class)
customElements.define('my-popup', class extends HTMLElement {
	connectedCallback(){
		this.innerHTML = `<div>팝업!</div>`
	}
});

// Or Shadow DOM 사용자 정의 요소
customElements.define('my-popup', class extends HTMLElement {
	constructor(){
		super();
		
		const shadowRoot = this.attachShadow({ mode: 'open' });
		shadowRoot.innerHTML = `<div>팝업!</div>`
	}
})
```
```html:title=index.html
<my-popup></my-popup>
```

### customElements.define() : 사용자 요소 정의
```js
define(name, constructor, options) // CustomElementRegistry method
```
- `name` 사용자 정의 요소 이름  
	규칙: 소문자 시작, 하이픈 꼭 포함(HTML 요소와 구분하기 위함)
- `constructor` 생성자 class 객체
- `options` 선택사항 `{extends: "p"}`

### Constructor (생성자) : 인스턴스 객체 초기화
```js
constructor(){
	super();
}
// Or Shadow DOM 생성
constructor(){
	super();
	this.attachShadow({ mode: 'open' });
}
```
- 직접적인 DOM 조작 금지
- 항상 `super()` 호출 (부모 생성자 호출 후 `this` 사용 가능)
	- `super()` : 상속 받은 부모 클래스(HTMLElement)의 생성자 호출
	- `super()` 필요한 경우
		- 내부 상태 초기화
		- shadow DOM 생성 시
		- 이벤트 핸들러 사전 바인딩 시
		- 재 렌더링 방지용 flag (`this._initialized="flase"`)

### 커스텀 요소 수명 주기 (lifecycle callbacks)
- connectedCallback : DOM 첫 렌더, 요소가(`<my-popup>`) DOM에 연결될 때마다 호출
	- constructor 사용 안할 시 명시하지 않아도 됨
- attributeChangedCallback : 속성 변경 시 변경된 부분만 업데이트
- disconnectedCallback : 요소가 DOM에 연결 해제 되었을 때마다 호출


## userAgent
### `navigator.userAgent`
- 브라우저와 운영체제 정보 문자열
- 최신 브라우저는 개인정보를 위해 단순화하여 신뢰도 낮음
- 표준화 되어있지 않기때문에 세밀한 필터 불가
- 디바이스 감지 정도에만 사용
```js
const isMobile = /iPhone|iPad|iPod|Android|BlackBerry|Windows CE/i.test(navigator.userAgent)
```

### `navigator.userAgentData`
- UA 객체
- 최신 브라우저에서만 사용

## window.localStorage
> [EventTarget] &leftarrow; [Window]
Methods | &nbsp; 
:---|:---
`localStorage.setItem(keyName, keyValue)` | string, array 불가
`localStorage.getItem(keyName)` | 키 값(string) 반환, 없으면 null
`localStorage.removeItem(keyName)` | 키 값 제거

## window.requestAnimationFrame() method
> 브라우저가 다음 화면을 그리기 직전 콜백 실행 (브라우저 주사율 기준 보통 60Hz)

### setInterval 과 비교
&nbsp; | `requestAnimationFrame` | `setInterval` 
:------|:------------------------|:--------------------
실행 타이밍 | 다음 프레임 직전 | 지정한 ms 무조건 실행
백그라운드 | 자동 일시정지 (효율적) | 계속 실행 (낭비)
프레임 동기화 | 정확히 맞춤 (부드러움) | 어긋날 수 있음
중지 | `cancelAnimationFrame(id)` | `clearInterval(id)`

```js
const reqAni = () => {
	const currentLeft = parseFloat(~.style.left) || 0
	~.style.left = currentLeft + 10 + 'px'

	if (currentLeft < 300) {
		requestAnimationFrame(reqAni)
		// return 시에도 멈춤
	}
}
reqAni()
```
```js
const setInt = setInterval(()=>{
	const currentLeft = parseFloat(~.style.left) || 0;
	~.style.left = currentLeft + 10 + 'px';

	if(currentLeft > 300){
		clearInterval(setInt);
	}
}, 16) // 16ms씩 무조건 실행
```

## 사이즈와 스크롤
### Window Size
Properties | &nbsp; 
:---|:---
`window.innerWidth` <br /> `window.innerHeight` | 브라우저 메뉴바, 툴바, 스크롤바 제외
`window.outerWidth` <br /> `window.outerHeight` | 브라우저 메뉴바, 툴바, 스크롤바 포함

### Size
Properties | &nbsp; 
:---|:---
`Element.clientWidth` <br /> `Element.clientHeight` | Element + padding (스크롤 바 생길 시 제외)
`Element.scrollWidth` <br /> `Element.scrollHeight` | 스크롤 영역 밖 모든 콘텐츠 Element + padding (스크롤 바 생길 시 제외)
`HTMLElement.offsetWidth` <br /> `HTMLElement.offsetHeight` | Element + padding + border (스크롤 바 생길 시 동일)

### Margin size
Window Methods | &nbsp;
:---|:---
`HTMLElement.style.marginLeft` | 인라인 스타일로 지정된 값(String) <br /> 예) 20<u>px</u>
`getComputedStyle(Element).marginLeft` | css 포함 적용된 스타일 값(String)

### Scroll
Properties | &nbsp; 
:---|:---
`window.scrollX` `window.scrollY` <br /> === `.pageXOffset` `.pageYOffset` | 스크롤 된 픽셀 수
`Element.scrollLeft` <br /> `Element.scrollTop` | Element 내부(overflow:auto) scroll 픽셀 수 get, set <br /> 설정(set) `Element.scrollTop = number`
`HTMLElement.offsetLeft` <br /> `HTMLElement.offsetTop` | 부모 position 기준 상대 좌표 <br /> (부모에 position 없을 시 `<body>` 좌표 또는 `<table>` 좌표)

Methods | &nbsp;
:---|:---
`window(Element).scrollTo(x, y)` <br /> `.scrollTo({top:y, left:x, behavior: '...'})` <br /> === `.scroll()` | 해당 좌표로 스크롤
`window(Element).scrollBy(x, y)` <br /> `.scrollBy({top:y, left:x, behavior: '...'})` | 현재 좌표 기준으로 해당 좌표만큼 스크롤
`Element.getBoundingClientRect()` | Element 크기, 위치 정보를 담은 DOMRect 객체 반환 <br /> `x` / `left`, `y` / `top`, `right`, `bottom` <br /> `width`, `height`, : padding 더한 값

#### 부모에 position 있어도 `<body>` Scroll 값(절대 값) 사용할 때:
`window.scrollY + Element.getBoundingClientRect().top;`


## Cookie
> key=value 와 option(path, expires) 문자열

### set
```js
function setCookie(name, value, setExpires) {
	const numericDays = Number(setExpires) || 0;
	const expireDate = new Date();
	expireDate.setDate(expireDate.getDate() + numericDays);
	document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${expireDate.toUTCString()}; path=/; SameSite=Lax; Secure`;
}
setCookie('cookieName', 'cookieValue', 7)
```
- `encodeURIComponent` `decodeURIComponent`
	- .cookie 는 HTTP 헤더 통해 전달: Protocol 준수, 데이터로 인해 쿠키 문자열 형식(`=` `;` `,` ...) 파괴 방지<br>
		ex) name: `user=NA=;ME;`

- `SameSite` : 교차 사이트 요청
	- `SameSite=Strict;` : 도메인 완전히 일치
	- `SameSite=Lax;` : iframe, AJAX 호츨에는 전송하지 않음 (일반적)
	- `SameSite=None;` : 도메인 달라도 무조건 전송, Secure 속성 설정되어야만 작동
- `Secure` : HTTPS 연결에만 쿠키 전송

### get
```js
function getCookie(name){
	const escapedName = encodeURIComponent(name).replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1');
  const nameMatche = document.cookie.match(new RegExp(
    "(?:^|; )" + escapedName + "=([^;]*)"
  ));
  return nameMatche ? decodeURIComponent(nameMatche[1]) : null;
}
```
- `$1` : 첫 번째 그룹 `(...)` 에서 매치된 텍스트 그대로 치환 <br/>
	ex) * &rightarrow; /* (Escape)
- escaped 이유: 정규 표현식 정확히(특수 기호 일반 문자열로 변경) 매칭 <br>
	ex\) name: `user.name` 일 경우 (패턴 `.`: 모든 문자 1개 매칭) &rightarrow; `user_name` `user*name` 매칭

### delete
```js
function deleteCookie(name){
	const initDate = "Thu, 01 Jan 1970 00:00:00 GMT"
	document.cookie = `${encodeURIComponent(name)}=; expires=${initDate}; path=/; SameSite=Lax; Secure`
}
```
- 유닉스 타임(Unix Epoch) 시작점
- setCookie 와 option 동일하게 지정

## Geolocation API
> 현재 위치 가져오는 API (HTTPS에서만 사용 가능)
```js
function succeess(coords) {
	coords.latitude     //위도
	coords.longitude    //경도
}
navigator.geolocation.getCurrentPosition(success, error, [options]);
```

## getAnimations()
> 요소에 현재 적용 중인 모든 애니메이션 Promise 객체 배열 반환

```js
element.getAnimations()
```
- `.playbackRate` : 재생 속도
- `.finished` : 완료 시
- `.cancel()` : 실행 중인 모든 애니메이션 종료

```js
element.getAnimations().map(ani => ani.playbackRate = 0.5)
```

## JavaScript
## JSON
Methods | &nbsp; 
:---|:---
`JSON.stringify()` | Object, array &rightarrow; JSON String
`JSON.parse()` | JSON String &rightarrow; Object, array

## Promise()
> 비동기 작업의 최종 완료 또는 실패 나타내는 객체
```js
new Promise(executor)
```
### Promise State  
Pending | Fullfilled | Rejected

### 생성
```js
const myPromise = new Promise((resolve, reject) =>{
	resolve(value)
	//or
	reject("에러")
})
```
### 사용
```js
myPromise
	.then(data => data)
	.catch(error => console.error(error))
	.finally(()=> 작업종료)
```
```js
async function handlePromise(){
	try{
		const data = await myPromise;

	}catch(error){
		console.error(error)

	}finally{
		작업종료
	}
}
```

Promise Array        | 반환 시점                  | 결과
:--------------------|:--------------------------|:--------------
Promise.all()        | 하나라도 실패 시 바로 reject | resolve 배열 또는 reject(첫 번째 reject)
Promise.allSettled() | 모든 Promise 처리된 후  | 상태 포함한 객체 배열 <br /> `[{status: 'fullfilled', value: Array...}, {status: 'rejected', reason: ...}]`


* * *

- [사용자 정의 요소](https://developer.mozilla.org/ko/docs/Web/API/Web_components/Using_custom_elements)
- https://web.dev/articles/shadowdom-v1?hl=ko

