---
version: alpha
name: PL AI Agent
description: 손익 관리 AI 에이전트

colors:
  primary: '#004098'
  primary-active: '#083c85'
  secondary: '#4778CC'
  secondary-active: '#285cb6'
  canvas: '#FFFFFF'
  surface-soft: '#F6F8FC'
  surface-info: '#E7EDF8'
  surface-dim: '#f0f1f3'
  surface-error: '#ffe2e7'
  body: '#222222'
  muted: '#6e6e6e'
  success: '#84BD00'
  info: '#315FB0'
  warning: '#F6BE00'
  error: '#b93e52'
  border-strong: '#c0c0c0'
  border-default: '#e2e2e2'

typography:
  display-lg:
    fontFamily: 'Noto Sans KR'
    fontSize: 36px
    fontWeight: 500
  title-md:
    fontFamily: 'Noto Sans KR'
    fontSize: 26px
    fontWeight: 500
  title-sm:
    fontFamily: 'Noto Sans KR'
    fontSize: 16px
    fontWeight: 500
  body-md:
    fontFamily: 'Noto Sans KR'
    fontSize: 14px
    fontWeight: 400
  label-caps:
    fontFamily: 'Noto Sans KR'
    fontSize: 16px
    fontWeight: 400
  button:
    fontFamily: 'Noto Sans KR'
    fontSize: 14px
    fontWeight: 500
    line-height: 1
  tab:
    fontFamily: 'Noto Sans KR'
    fontSize: 16px
    fontWeight: 500
    line-height: 1

rounded:
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 20px
  xl: 32px
  xxl: 48px
  section: 96px
---

# Design System

## Overview

손익을 실시간으로 모니터링하고, AI기반 분석 추천을 통해 의사결정을 지원하는 손익관리 서비스.
무게감 있는 네이비와 화이트에 가까운 회색 캔버스 대비로 데이터의 무게감을 표현하면서 둥근 모서리와 여백을 충분히 확보해 압박감을 줄임.
Clarity over Decoration. Hierarchy through Contrast.

## Colors

- **Primary** (`{colors.primary}` - #004098): CTAs, active states, key interactive elements
- **Secondary** (`{colors.secondary}` - #4778CC): Supporting UI, chips, secondary actions
- **Canvas** (`{colors.canvas}` - #FFFFFF): 기본 페이지 배경(Surface); 모든 에디토리얼 본문(body)의 바탕이 되는 레이어.
- **SurfaceSoft** (`{colors.surfaceSoft}` - #F6F8FC): 탭 구조의 피처(Feature) 카드 및 강조할 요금제(Pricing tier) 카드에 사용되는 배경색.
- **surfaceInfo** (`{colors.surfaceInfo}` - #E7EDF8): 정보, Key Insight 영역의 보조 Surface

### Text

- **Body** (`{colors.body}` - #222222): 본문 기본 글자 색상
- **Muted** (`{colors.muted}` - #6e6e6e): 브레드크럼, 캡션

### Semantic

- **Success:** (`{colors.success}` - #84BD00): 완료 및 긍정적 상태
- **Info:** (`{colors.info}` - #315FB0): 정보
- **Warning:** (`{colors.warning}` - #F6BE00): 대기 및 주의 필요 상태
- **Error:** (`{colors.error}` - #b93e52): 에러, 반려, 재고 부족, 폼 유효성 검사 실패

## Typography

### Font Family

이 시스템은 **Noto Sans KR** 서체를 사용합니다. 대체 서체 Fallback stack은 `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif` 순으로 적용됩니다.

### Hierarchy

| Token                     | Size | Weight | Line Height | Letter Spacing | Use                                               |
| ------------------------- | ---- | ------ | ----------- | -------------- | ------------------------------------------------- |
| `{typography.title-md}`   | 26px | 500    | 1           | 0              | Section title                                     |
| `{typography.title-sm}`   | 16px | 500    | 1           | 0              | Section sub-title                                 |
| `{typography.body-md}`    | 14px | 400    | 1.4         | 0              | Body copy, Input text, Select text, top-nav items |
| `{typography.display-lg}` | 36px | 500    | 1.2         | 0              | 정보성 텍스트                                     |

## Layout

### Spacing System

- **Base unit** 4px (all spacing snaps to 4-multiples).
- **Tokens:** `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 20px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 96px.
- **Ai Chat Sidebar Padding** `{spacing.lg}` (20px)

### Grid & Container

- **Max content width:** 대시보드 레이아웃(~1440px에서 1920px 확장형)
- **Layout Split**
  - **Left(Datepicker)** width (120px), 년 월 선택 데이트피커.
  - **Center(Main)** max-width (1000px), Padding `{spacing.xl}` (32px), 메인 컨텐츠.
  - **Right(Ai Chat Sidebar)** width (400px), Padding `{spacing.lg}` (20px), Toggle Button 으로 접고 펼치기, 독립적 스크롤 영역.

## Elevation

전체적으로 평면적(Flat) 스타일을 유지합니다. 레이어 구분이 반드시 필요한 모달(Modal), Float Button 요소에만 제한적으로 그림자를 사용합니다.

## Spacing

상하 여백을 확보해 정보의 압박감을 줄입니다.

## Components

### Application Header (Top Navigation Bar)

The application header is a fixed, full-width bar that appears on every page. It establishes the product's primary brand presence and houses global filters and user controls.

#### Container

| Property      | Value                                           |
| ------------- | ----------------------------------------------- |
| Position      | `sticky top-0` / `fixed top-0`                  |
| Height        | `50px`                                          |
| Background    | `{colors.canvas}`                               |
| Text color    | `{colors.body}`                                 |
| Padding       | `0 {spacing.xl}` horizontal                     |
| Z-index       | `100` (above page content, below modals)        |
| Shadow        | none — color contrast alone provides separation |
| Border-bottom | `1px solid {colors.border-default}`             |

#### Layout Regions (left → right)

The header is divided into four regions using `flex` with `justify-between`:

1. **Brand region** hamburger menu icon (`24px`) + product logomark (`32px` white square with "PL" wordmark) + product name (`PL AI Agent`, weight 600, size 16px)
2. **Date Picker** Preve icon (`24px`) + Selected Date + next icon (`24px`)
3. **User region** user avatar + name + role label (`홍길동 프로`)

#### Spacing rules

- Gap between regions: `{spacing.xl}`
- Gap between elements within a region: `12px`
- Filter dropdowns and toggles share the same vertical alignment (centered to header height)

#### States

| Element                   | Default                                 | Hover                                       | Active                       |
| ------------------------- | --------------------------------------- | ------------------------------------------- | ---------------------------- |
| Hamburger / icon button   | `opacity 1`, white                      | `bg-white/10`                               | `bg-white/20`                |
| Dropdown                  | white bg, navy border-none              | border `1px solid var(--color-primary-300)` | open: ring `2px primary-400` |
| Toggle segment (inactive) | `text-white/70`, transparent            | `text-white`, `bg-white/10`                 | n/a                          |
| Toggle segment (active)   | `bg-white`, `text-navy-900`, weight 600 | unchanged                                   | unchanged                    |
| User chip                 | `text-white`                            | `bg-white/10`, rounded `6px`                | n/a                          |

### Table

- **Font:** (14px)
- **Row Height:** (36px)

### Input Fields

- **Base Style** 기본 Input. background #FFFFFF, height 36px, border `1px solid {colors.border-default}`, border radius `{rounded.xs}`, padding 6px × `{spacing.sm}`
- **States:**
  - **Hover:** border `1px solid {colors.border-strong}`
  - **Focus:** border `1px solid {colors.secondary}`
  - **Disabled:** 텍스트 `{colors.muted}`

### Dropdown Select

- 기본 Select. background #FFFFFF, height 36px, border `1px solid {colors.border-default}`, border radius `{rounded.xs}`, padding 6px

### Textarea

- **Base Style** 기본 Textarea. background #FFFFFF, min-height 54px, border `1px solid {colors.border-default}`, border radius `{rounded.xs}`, padding 6px × `{spacing.sm}`, line-height:1.5
- **States:**
  - **Hover:** border `1px solid {colors.border-strong}`
  - **Focus:** border `1px solid {colors.secondary}`
  - **Disabled:** 텍스트 `{colors.muted}`

### Buttons

기능의 중요도와 성격에 따라 분리하여 사용합니다. 모든 버튼의 기본 Base는 Height `36px`, rounded `{rounded.xs}`

**`button-primary`** — The signature primary CTA. background #FFFFFF, text `{colors.primary}`, typography `{typography.button}`, padding 8px × `{spacing.md}`, border `1px solid {colors.primary}` rounded `{rounded.xs}` (4px).

- Active state: `button-primary-active` darkens to `{colors.primary-active}` (#083c85).

**`button-secondary`** — background #FFFFFF, text `{colors.secondary}`, typography `{typography.button}`, padding 8px × `{spacing.md}`, border `1px solid {colors.secondary}`, rounded `{rounded.xs}` (4px).
**`button-secondary-fill`** — background `{colors.secondary}`, text #FFFFFF, typography `{typography.button}`, padding 8px × `{spacing.md}`, border `1px solid {colors.secondary}`, rounded `{rounded.xs}` (4px).

### Navigation & Tabs

**Segmented Tabs (Header 컨텐츠 탭):**

- 빈틈없이 붙어 있는 수평 그룹, 전체를 감싸는 Pill 모양 컨테이너 안 활성화된 탭과 강한 대비.
- **Container** background #FFFFFF, rounded `{rounded.full}`, 모든 Segment 를 감싸는 완전한 둥근 형태의 Pill 모양.
- **Segments** 좌우로 나란히 배치되는 개별 인터랙티브 영역, rounded `{rounded.full}`, typography `{typography.tab}`, padding 6px × `{spacing.sm}`.
  - **Inactive** background #FFFFFF, text `{colors.primary}`.
  - **Active** background `{colors.primary}`, text #FFFFFF.
  - **Interaction** 활성 상태가 전횐될 때 부드러운 좌우 슬라이딩 애니메이션

**Underline Tabs (Main 컨텐츠 탭):**

- **Container** 왼쪽 정렬 구조로 배치, 개별 탭 요소들은 가로로 나열, 전체 탭 세트 하단에 얇은 구분 선 border-bottom `1px solid {colors.border-color}`
- **Segments** 좌우로 나란히 배치되는 개별 인터랙티브 영역, typography `{typography.tab}`, padding 10px × `{spacing.sm}`.
  - **Inactive** text `{colors.muted}`.
  - **Active** text `{colors.body}`, 하단 밑줄 `{colors.primary}` 색상의 2px.
  - **Interaction** 활성 상태가 전횐될 때 Active 의 하단 밑줄 부드러운 좌우 슬라이딩 애니메이션

### Selection Controls (Checkbox & Radio)

사용자 입력 요소입니다. Base Size는 Width `14px`, Height `14px`입니다. 텍스트 라벨은 우측에 배치하고 클릭 영역(Hit area)을 라벨까지 포함시킵니다.

- **Checkbox:**
  - **Default:** 빈 사각형, border `1px solid {colors.border-color}`.
  - **Checked:** border `1px solid {colors.secondary}`, background `{colors.secondary}`, 흰색 체크 마크.
  - **Disabled:** background `#E3E3E3`, border `#BEBEBE` (클릭 불가).
  - **Checked Disabled:** background `#BEBEBE`, border `#9D9D9D`, 흰색 체크 마크 (클릭 불가).
- **Radio Button:**
  - **Default:** 빈 원형, border `1px solid {colors.border-color}`.
  - **Checked:** border `1px solid {colors.secondary}`, background `{colors.secondary}`, 테두리 및 내부 점(Dot).
  - **Disabled:** background `#E3E3E3`, border `#BEBEBE` (클릭 불가).
  - **Checked Disabled:** 원형 border `#BEBEBE`, 내부 점 `#9D9D9D` (클릭 불가).

## Do's and Don'ts

- **Do:** Always pair the navy background with white or near-white foreground.
- **Do:** 접근성 준수를 위해 폼 요소에는 명확한 라벨(Label)을 포함하세요.
