---
date: '2026-04-30'
title: 'gatsby'
categories: ['Design']
summary: ''
thumbnail: './img1.jpg'
---


### SVGR
> SVG 파일을 React 컴포넌트로 자동 변환해주는 도구
- Inline SVG로 CSS/JS 제어 가능
- 트리 쉐이킹, 최적화([svgo](https://github.com/svg/svgo)) 자동 적용

### Next 16 세팅
- Next 15 `experimental.turbo` &rightarrow; 최상위 `turbopack` 으로 변경  
	Turbopack은 내부적으로 Webpack 로더 지원
- svgo 옵션 끄기(svgo 최적화 시 viewBox 제거해 버리며 간헐적으로 깨짐)  
	최적화는 svg 파일 안에서하기

&nbsp; | Turbopack(Webpack) | CLI
:------|:----------|:------
&nbsp; | 실행(빌드) 후 import 할 때 즉석에서 컴포넌트로 변환 | 명령어로 파일 미리 생성
파일 관리 | 원본 SVG만 관리 | 각 컴포넌트(.tsx) 파일
&nbsp; | SVG 동적으로 import | 아이콘 수가 많고 미리 변환해야할 때

## 1. Turbopack
### svgr 옵션 설정
```js:title=next.config.mjs
const nextConfig = {
  turbopack: {
    rules: {
      '*.svg': {
        loaders: [
          {
            loader: '@svgr/webpack',
            options: {
              svgo: false,
            },

						/* viewBox 옵션만 끄고 싶다면 ******* */
						options: {
              svgoConfig: {
                plugins: [
                  {
                    name: 'preset-default',
                    params: {
                      overrides: {
                        removeViewBox: false,
                      },
                    },
                  },
                ],
              },
            },
						/* ******************************* */

          },
        ],
        as: '*.js',
      },
    },
  },
}
```
### TypeScript 설정
```ts:title=svgr.d.ts
declare module '*.svg' {
  import { FC, SVGProps } from 'react';
  const content: FC<SVGProps<SVGSVGElement>>;
  export default content;
}

declare module '*.svg?url' {
  const content: any;
  export default content;
}
```
```ts:title=tsconfig.json
{
	"include": [
	"svgr.d.ts",   // 첫 번째 아이템
	"next-env.d.ts",
	"**/*.ts",
	"**/*.tsx",
	".next/types/**/*.ts",
	".next/dev/types/**/*.ts"
	],
	//...
}
```

## 2. CLI
### svgr 옵션 설정
```js:title=.svgrrc.json
{
  "prettier": false,
  "typescript": true,
  "ext": "tsx",
  "svgo": false,
  "svgProps": {
    "fill": "currentColor"
  },
  "icon": false,
  "jsxRuntime": "automatic"
}
```
```
pnpm dlx @svgr/cli assets/icons --out-dir components/ui/icons/generated
```
#### 결과
```tsx:title=components/ui/icon/generated/index.tsx
export { default as Box } from './Box'
```
```tsx:title=components/ui/icon/generated/Box.tsx
import type { SVGProps } from "react";
const SvgBox = (props: SVGProps<SVGSVGElement>) => <svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
 ...
</svg>;
export default SvgBox;
```

### Custom index template
- `<IconSome />` 형태로 re-export 하고 싶을 때
```js:title=script/svgr-index-template.mjs
import path from 'path';

export default function defaultIndexTemplate(filePaths) {
	// 커스텀
  const exportEntries = filePaths.map(({ path: filePath }) => {
    const basename = path.basename(filePath, path.extname(filePath));
    const pascalName = basename
      .replace(/[-_ ]+(.)/g, (_, c) => c.toUpperCase())
      .replace(/^(.)/, (c) => c.toUpperCase());
    return `export { default as Icon${pascalName} } from './${basename}'`;
  });
  return exportEntries.join('\n');
}
```
```
pnpm dlx @svgr/cli --index-template scripts/svgr-index-template.mjs assets/icons --out-dir components/ui/icons/generated
```

#### Custom index template 결과
```tsx:title=components/ui/icon/generated/index.tsx
export { default as IconBox } from './Box'
```

### SVG Wrapper
- `<IconSome size="md">` 공통 prop 추가하고 싶을 때
- 복잡한 형태로 꼭 필요한 상황인지 확인
```js:title=script/generate-icon-components.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GENERATED_DIR = path.join(__dirname, '../components/ui/icons/generated');
const OUTPUT_FILE = path.join(__dirname, '../components/ui/icons/IconComponents.tsx');

const files = fs.readdirSync(GENERATED_DIR);
const iconNames = files
  .filter((file) => file.endsWith('.tsx') && !file.startsWith('index'))
  .map((file) => file.replace('.tsx', ''));

const fileHeader = `import { Icon, IconProps } from './Icon';

`;
const exportLines = iconNames
  .map(
    (name) =>
      `export const Icon${name} = (props: Omit<IconProps, 'name'>) => <Icon name="${name}" {...props} />;`,
  )
  .join('\n');
const finalCode = fileHeader + exportLines;

fs.writeFileSync(OUTPUT_FILE, finalCode, 'utf-8');
```
- 명령어 스크립트 설정
```js:title=package.json
"scripts":{
	//...
	"svgr:icons": "pnpm dlx @svgr/cli assets/icons --out-dir components/ui/icons/generated",
	"gen:icons": "node scripts/generate-icon-components.mjs",
	"svg:icons": "npm run svgr:icons && npm run gen:icons",
	//...
}
```
#### 결과
```js:title=components/ui/icons/IconComponents.tsx
import { Icon, IconProps } from './Icon';

export const IconBox = (props: Omit<IconProps, 'name'>) => <Icon name="Box" {...props} />;
```

* * *

https://react-svgr.com/docs/next/


* * *


### TypeScript key값 타입 추출
```js
export type NAME = (typeof 배열)[number]['name'];
export type NAME = keyof typeof 객체
```


### Node.js

`path` 파일 경로 계산 | &nbsp; 
:----------------|:-----
`path.join()`    | 여러 경로 조각 OS에 맞게 합침
`path.resolve()` | 절대 경로 생성
`path.dirname()` | 경로에서 dir 부분만 반환
`path.basename(경로)` <br /> `path.basename(경로, '.확장자)`| 전체 경로에서 마지막부분(파일 명)만 추출 <br /> 파일명만 추출
`path.extname()` | 파일 확장자만 추출

`path` ES Module에서 사용시 | &nbsp;
:---------------|:--------------------
`import.meta.url` | 현재 모듈시스템 URL
`fileURLToPath()` | URL 형태를 OS가 이해하는 경로로 변환 <br /> `file:///Users/...` &rightarrow; `/Users/...`
`pathToFileURL()` | 파일 경로를 URL로 변환

- ES Module에서 보안, 표준 준수로 `__dirname` `__filename`을 제공하지 않기때문에 표준 공식 사용


`fs` 파일 동기적 처리 | &nbsp;
:--------------------|:-----
`fs.readFileSync()`  | 파일 내용 읽기
`fs.writeFileSync()` | 파일 만들기/내용 쓰기
`fs.readdirSync()`   | 폴더 안의 파일 목록 가져오기

