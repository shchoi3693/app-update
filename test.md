#design

> 표준화된 형식을 통해 디자인 시스템, 스타일 가이드, 컴포넌트 사양을 AI에게 명확하게 전달

- **YAML front matter**에 머신러닝이 읽을 수 있는 디자인 토큰 포함되어 일관성을 강제하기 위한 정밀한 값
- **Markdown body**는 사람이 읽을 수 있는 디자인 근거 제공

### 디자인 토큰 (Design tokens)
> 문서 최상단에 YAML front matter로 정의
- 이 블록은 반드시 `---` `---` 사이에 작성
- Figma 변수 및 Tailwind 테마 설정(theme configs)과 쉽게 상호 변환

```markdown
---
version: <string>          # optional, current version: "alpha"
name: <string>
description: <string>      # optional
colors:
  <token-name>: <Color>
typography:
  <token-name>: <Typography>
rounded:
  <scale-level>: <Dimension>
spacing:
  <scale-level>: <Dimension | number>
components:
  <component-name>:
    <token-name>: <string | token reference>
---
```

### Sections
- 관련 없는 색션은 색량 가능하지만 아래 순서대로 나열
&nbsp; | Section | Aliases (허용되는 별칭)
:------|:--------------|:-------
1      |Overview       | Brand & Style
2      |Colors         | &nbsp;
3      |Typography      | &nbsp;
4      |Layout          | Layout & Spacing
5      |Elevation & Depth | Elevation
6      |Shapes            | &nbsp;
7      |Components       | &nbsp;
8      |Do’s and Don’ts  | &nbsp;

1. Overview : 전체적인 설명. 브랜드 성격, 타겟 사용자. 기초적인 문맥 (Foundational context)
2. Colors : 최소한 primary 는 반드시 정의
3. Typography : Semantic role(Headline, body) 단계와 크기 variant(sm, md, lg) 정의
4. Layout : 그리드 모델, 간격 스케일(scale 4px 배수, dense, base)
5. Elevation & Depth

* * *
- [stitch DESIGN.md](https://stitch.withgoogle.com/docs/design-md/specification)

