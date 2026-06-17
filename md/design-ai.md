---
date: '2026-04-30'
title: 'Design.md'
categories: ['Design']
summary: 'Google Stitch Design.md'
thumbnail: './img1.jpg'
---

## Design.md
> 의미론적 사전 역할

- Google Stitch의 오픈 소스
- AI 도구 전반에 걸쳐 일관적
- 버전 관리 가능
- 의도 중심적 (Intend-driven) : 예외적인 상황에서도 명확하게 디자인
- Scalable
- 이해하기 쉬워 접근성 좋음

## 표준 섹션

### 1. YAML front matter
> 맨 위 YAML 블록
- 디자인 토큰 코드로 자동 변환
- 버전, 브랜드 명, description (감성적이고 철학적 기반 : 태도, 분위기, 영감) 
- 형용사적 `단호한 침착함` `활기찬 명확한 정보 전달` &rightarrow; 획일적인 디자인을 피하게 해줌

```markdown
---
version: alpha
name: Lumenpath
description: 모든 주요 핵심 요소가 단 하나의 탠저린(감귤색) 액센트 컬러로 구동되는, 밝고 시트러스한 온기의 제품 캔버스입니다. 디스플레이 서체는 과하지 않은 굵기에서도 크고 자신감 넘치는 형태를 유지하며, 카드 요소들은 그림자 대신 아주 가는 실선 테두리로 구분되어 옅은 크림빛 표면 위에 부드럽게 떠 있는 느낌을 줍니다.
colors:
	primary: "#0a0a0a"
	brand-pink: "#b9446d"
	brand-teal: "#194949"
typography:
	body:
		fontFamily: Suit
		fontSize: 14px
		fontWeight: 400
...
---
```

### 2. Colors
> 색상 값 정의, semantic 색상 정의
- 역할과 의미를 바탕으로 명명 (단순한 red 가 아닌 error)

```markdown
## Color palette and roles

### Brand & Accent
- **Primary Text** (`{colors.primary-text}` — #0a0a0a): 메인 텍스트.
- **Text error** (`{colors.text-error}` — #BA0C2F): 에러, 반려, 폼 유효성 검사 실패.
- **Brand Pink** (`{colors.brand-pink}` — #b9446d): Pink 색상의 기능 카드 표면(Surface). 시퀀서(Sequencer) / 아웃바운드(Outbound) 기능 페이지.
- **Brand Teal** (`{colors.brand-teal}` — #194949): Teal 색상의 기능 카드 표면(Surface). 기능 페이지.
```
```markdown
## Color palette and roles

| Role           | Token            | Value      | Usage |
|----------------|------------------|------------|-------|
| Primary text   | --primary-text   | #0a0a0a  | 메인 텍스트 |
| Text error     | --text-error     | #BA0C2F  | 에러, 반려, 폼 유효성 검사 실패  |
| Brand Pink     | --brand-pink     | #b9446d  | Pink 색상의 기능 카드 표면(Surface). 시퀀서(Sequencer) / 아웃바운드(Outbound) 기능 페이지 |
| Brand Teal     | --brand-teal     | #194949  | Teal 색상의 기능 카드 표면(Surface). 기능 페이지 |
```

### 3. Typography
> 계층 구조와 맥락을 포함한 전체 타이포그래피 시스템 정의
- Font family
- 계층, size, weight, line-height, letter-spacing, 설명

```markdown
## Typography rules

Font family: Suit (UI), JetBrains Mono (code/monospace)
| Level       | Size   | Weight | Line-height | Letter-spacing | Notes |
|-------------|--------|--------|-------------|----------------|-------|
| Display     | 48px   | 600    | 1.1         | -2px           | Page titles |
| Heading     | 24px   | 500    | 1.3         | -0.5px         | Section headers |
| Body        | 15px   | 400    | 1.6         | 0              | Main text |
```

### 4. Layout
> 그리드 및 간격 시스템
- 기본 간격 단위
- 간격 스케일
- Max width, gap

```markdown
## Layout principles

- Base unit: 4px
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64px
- Max content width: 1280px (centered)
```

### 5. Elevation and Depth
> 그림자, 테두리를 통해 레이어링, 시각적 계층 구조 정의
- 시각적 계층 구조 shadow, 그림자 없는 flat 디자인의 경우 border, color tone, color 대비

```markdown
## Elevation and Depth
> 시각적 계층
| Level | Usage                  | Shadow Value                     |
|-------|------------------------|----------------------------------|
| 0     | Background             | none                             |
| 1     | Cards, sidebars        | 0 1px 3px rgba(0,0,0,0.2)      |
| 2     | Modals, popovers       | 0 8px 24px rgba(0,0,0,0.3)     |
```

### 6. Shapes
> 요소 형태
- border-radius, border
- Language shape
```markdown
| Level | Token            | Value  | Usage                |
|-------|------------------|--------|----------------------|
| none  | --radius-none    | 0px    | 화면 전체 꽉 찬 배너 등 |
| sm    | --radius-sm      | 4px    | 버튼, 인풋 박스, 배지, 체크박스 등 |
| md    | --radius-md      | 8px    | 기본 카드 컴포넌트, 모달 창, 드롭다운 메뉴 등 |
| lg    | --radius-lg      | 12px   | 메인 대시보드 판넬, 대형 다이얼로그 등 |
| full  | --radius-full    | 9999px | 칩 버튼, 아바타 프로필, 토글 스위치 등 |
```

### 7. Component
> 재사용 가능한 UI요소에 대한 상세 사양
- 속성과 상호작용 상태
- 이전 섹션의 토큰들을 참조하여 사용 (컬럭 hex 값이 아닌, --accent-primary)

```markdown
## Component styles

### Button (Primary)
- Background: var(--accent-primary)
- Padding: 12px 24px
- Border-radius: 8px
- Hover: scale(1.02) + brightness(1.1)
- Real-time variant: subtle pulse animation when active
```

### 8. Do's and Don'ts
> 안티패턴 방지를 위한 명확한 설정
```markdown
## Do's and don'ts
**Do:**
- Use `--accent-live` for any real-time activity
- Keep animations subtle (≤300ms)
**Don't:**
- Don't use heavy shadows on surfaces (prefer borders)
- Don't mix warm and cool accents in the same view
```

### 9. 반응형
- Breakpoints
- 모바일 우선
```markdown
## Responsive Behavior
| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 720px | Hamburger nav; hero h1 56→32px; cards stack 1-up. |
| Tablet | 720–1024px | Top nav narrows; cards 2-up; sidebar collapses. |
| Desktop | 1024–1440px | Full top nav; 3-up card grid; sticky sidebar. |
| Wide | > 1440px | Content caps at 1440px; gutters absorb the rest. |

### Touch Targets
- Primary CTAs ≥ 44 × 44px (WCAG AAA).
- Form inputs at 48px height.

### Collapsing Strategy
- Top nav switches to hamburger below 720px.
- Card grid drops column count cleanly — never reflows rows.

## Known Gaps
- Animation and transition timings are out of scope.
- Form error/success states are not extracted on the captured surfaces.
- Dark mode is not a documented variant — the brand renders one canvas mode.
```

### 10. Agent Prompt Guide
> 이 .md를 사용하는 AI 에이전트를 위한 메타 지침
- 우선순위 규칙
- 접근성 관련 유의사항
```markdown
## Agent prompt guide
When generating UI:
1. Always reference tokens from sections 2-6
2. For real-time features, prioritize subtle animations
3. Ensure WCAG AA contrast minimums

1. 항상 2-6 section에 정의된 토큰을 참조하여 반영할 것.
2. 실시간 기능의 경우, 미세한 애니메이션을 우선적으로 적용할 것.
3. WCAG AA 대비도 최소 기준을 반드시 충족할 것.
```

## Frontend Design
> Anthropic 공식 SKILL.md
- Typography : Inter, Roboto, Arial을 피하고 개성있는 디스플레이폰트와 본문 폰트 조합
- Color and theme : CSS 변수 사용. accents 색상과 대비되는 dominant(주조색) 색상 사용
- Motion : 잘 조율된 한번의(페이지 로드 리빌) 애니메이션
- Spatial composition (공간 구성) : 비대칭성, 레이어 오버, 대각선 그리드
- Background : gradient mesh, noise texture, 기하학 패턴

[SKILL.md](https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md)
```
흔한 SaaS 제품 느낌이 아닌, 에디토리얼 매거진 잡지 화보 스타일. Fraunces나 Playfair 같은 세리프 디스플레이 폰트와 본문용의 깔끔한 기하학적 산세리프 폰트를 조합할 것.
주조색: 단 하나의 따뜻한 어스 톤(Earth tone, 대지의 자연색)에 단 하나의 강렬한 액센트 컬러를 조합.
모션: 사방에 흩어진 마이크로 인터랙션을 배제하고, 페이지 로드 시 딱 한 번 실행되는 잘 조율된 모션 모먼트를 연출.
절대 금지: Inter 폰트, 보라색(SaaS 특유의 컬러), 진부한 그라디언트, 흔해 빠진 3단 카드 형태의 기능 소개 그리드.
```


## Design AI 생성 현재 활용 방법
- 여러개의 사이트 생성 후(시안) 하나를 선택
- 프로젝트 규칙 폴더에서 관리

* * *

- https://getdesign.md/what-is-design-md
- https://thomas-wiegold.com/blog/claude-code-frontend-design-plugin/
- https://platform.claude.com/cookbook/coding-prompting-for-frontend-aesthetics
