---
version: alpha
name: ERP Dashboard
colors:
  primary: "#1A355E"
  secondary: "#315FB0"
  tertiary: "#E87502"
  neutral: "#333333"
  neutral-sub: "#6B6B6B"
  surface: "#EDEDED"
  success: "#278838"
  warning: "#B95E06"
  error: "#BA0C2F"
typography:
  font-families:
    headline: "SUIT, sans-serif"
    body: "SUIT, sans-serif"
    label: "SUIT, sans-serif"
  font-weights:
    headline: "600"
    body: "400"
    label: "500"
spacing:
  scale: "dense"
roundedness:
  base: "4px"
elevation:
  style: "flat"
---

# Design System: ERP Dashboard

## Overview
본 디자인 시스템은 복잡한 공급망 관리 및 재고 데이터를 명확하게 전달하기 위한 전문적이고 신뢰감 있는 인터페이스를 지향합니다. 사용자가 많은 양의 정보를 한눈에 파악하고 승인 프로세스를 오류 없이 입력하도록 직관적인 상태 구분을 강조합니다. 높은 정보 밀도를 위해 전반적으로 좁은 간격(dense spacing)을 유지하여 스크롤을 최소화합니다.

## Colors
토큰화된 색상 팔레트의 사용 목적입니다.
- **Primary:** `#1A355E` (메인 브랜드 컬러 및 헤더 영역)
- **Secondary:** `#315FB0` (주요 버튼 및 활성 상태 표시)
- **Tertiary:** `#E87502` (시각적 하이라이트 및 강조 요소)
- **Neutral:** `#333333` (주 텍스트 색상)
- **Neutral Sub:** `#6B6B6B` (보조 텍스트 및 카드 섹션 구분)
- **Surface:** `#EDEDED` (입력 폼 배경색 등 컴포넌트 하위 배경)
- **Success:** `#278838` (완료 및 긍정적 상태)
- **Warning:** `#B95E06` (대기 및 주의 필요 상태)
- **Error:** `#BA0C2F` (에러, 반려, 재고 부족, 폼 유효성 검사 실패)

## Typography
모든 폰트는 가독성이 뛰어난 산세리프 폰트 `SUIT`를 기본으로 사용합니다.
- **Headlines:** `SUIT`, Semi-bold (섹션 제목 및 주요 타이틀)
- **Body:** `SUIT`, Regular, `14px` (본문 및 일반 텍스트 데이터)
- **Labels:** `SUIT`, Medium, `14px` (폼 라벨, 버튼 텍스트, 컴포넌트 상태 텍스트)

## Elevation
전체적으로 평면적(Flat) 스타일을 유지합니다. 레이어 구분이 반드시 필요한 모달(Modal) 등 특정 요소에만 제한적으로 그림자를 사용합니다.

## Spacing
한 화면에 최대한 많은 데이터를 보여주기 위해 여백을 타이트하게(Dense) 가져가며, 불필요한 스크롤을 최소화합니다.

## Components

### Base Elements
* **카드 (Card):** Background `#FFFFFF`, Border `1px solid #EAEDF1`, Padding `15px 20px 20px`.
* **팝오버 (Popover):** Border `1px solid #D9D9D9`.
* **모달 (Modal):** Background `#FFFFFF`, Box-shadow `rgba(0, 0, 0, 0.15) 0px 2px 6px`.

### Table
대량의 리스트를 보여주기 위해 행(Row) 높이를 최소화하고, 상호작용 피드백을 명확히 합니다.
* **Font:** `13px` 사이즈 유지.
* **Row Height:** `30px`.
* **Border:** `1px solid #DADADA`.
* **Header (Th):** Background `Primary (#1A355E)`, 텍스트 흰색, 상단 곡률(Border-radius) `4px`.
* **Hover State:** 행(Row) 호버 시 배경색을 `#EDF3FB`로 변경하여 가독성 향상.

### Input Fields
모든 텍스트 입력창은 밀도를 높이기 위해 컴팩트한 사이즈를 유지합니다.
* **Base Style:**
  * **Height:** `30px` (표준 대시보드 그리드 정렬)
  * **Background:** `#FFFFFF`
  * **Border:** `1px solid #D9D9D9`
  * **Border Radius:** `4px`
  * **Padding:** 좌우 `8px`
* **States:**
  * **Hover:** Border `#40A9FF`
  * **Focus:** Border `Secondary (#315FB0)`, 옅은 블루 글로우(Shadow) 효과
  * **Disabled:** Background `#F5F5F5`, 텍스트 회색 처리

### Buttons
기능의 중요도와 성격에 따라 분리하여 사용합니다. 모든 버튼의 기본 Base는 Height `30px`, Rounded `4px`입니다.
* **Default Button:** Background `#FFFFFF`, Border `1px solid #DADADA`, Padding `0 10px`.
* **Iconic Buttons (툴바 상단):**
  * 관련 아이콘 + 텍스트 결합 (예: Search, Save, Excel).
  * 화이트 배경, 회색 테두리(Outline) 적용.
  * 시스템 전체 동작(전역 액션)에 사용.
* **Utility Buttons (테이블 하단 액션):**
  * 텍스트 전용 (예: Add, Delete, Undo).
  * 아주 연한 회색 또는 푸른색 배경의 Ghost 버튼 스타일.
  * 개별 행(Row) 조작 시 사용.

### Navigation & Tabs

* **Underline Tabs (페이지 내비게이션):**
  * 페이지 수준의 섹션 전환용. 배경/테두리 없이 텍스트 나열.
  * **Active:** `Secondary (#315FB0)` 컬러의 2~3px 두께 하단 밑줄(Indicator), 텍스트 굵기 강조.
  * **Inactive:** 중간 톤 회색, 밑줄 없음.
  * 탭 간 간격 최소 `24px`.
* **Segmented Tabs (데이터 필터/뷰 전환):**
  * 빈틈없이 붙어 있는 수평 그룹. 
  * 전체 외곽 곡률 `4px`, 내부 탭 사이 수직 구분선 `1px`.
  * **Active:** `Secondary (#315FB0)` 배경색, 짙은 테두리, 밝은 텍스트.
  * **Inactive:** 흰색 배경, 회색 텍스트.

### Selection Controls (Checkbox & Radio)
사용자 입력 요소입니다. Base Size는 Width `14px`, Height `14px`입니다. 텍스트 라벨은 우측에 배치하고 클릭 영역(Hit area)을 라벨까지 포함시킵니다.
* **Checkbox:**
  * **Default:** 빈 사각형, Border `Secondary (#315FB0)`.
  * **Checked:** Background `Secondary (#315FB0)`, 흰색 체크 마크.
  * **Disabled:** Background `#E3E3E3`, Border `#BEBEBE` (클릭 불가).
  * **Checked Disabled:** Background `#BEBEBE`, Border `#9D9D9D`, 흰색 체크 마크 (클릭 불가).
* **Radio Button:**
  * **Default:** 빈 원형, Border `Secondary (#315FB0)`.
  * **Checked:** 테두리 및 내부 점(Dot) `Secondary (#315FB0)`.
  * **Disabled:** Background `#E3E3E3`, Border `#BEBEBE` (클릭 불가).
  * **Checked Disabled:** 원형 Border `#BEBEBE`, 내부 점 `#9D9D9D` (클릭 불가).

## Do's and Don'ts
* **Do:** 복잡한 워크플로우 단계는 반드시 시각적 인디케이터(Stepper)를 사용하여 현재 위치를 명확히 표시하세요.
* **Do:** 접근성 준수를 위해 폼 요소에는 명확한 라벨(Label)을 포함하세요.
* **Don't:** 장식적인 요소나 지나치게 둥근 곡률(Roundness)은 지양하고, 전문적인 느낌을 위해 `4px`의 절제된 곡률을 일관되게 사용하세요.