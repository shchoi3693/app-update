---
date: '2026-04-20'
title: 'test'
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

### 1. Turbopack
#### svgr 옵션 설정
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
#### TypeScript 설정
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

### 2. CLI
#### svgr 옵션 설정
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
- svgr 명령어 입력
```
svgr assets/icons --out-dir components/ui/icon/generated
```
- 결과
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

- `<Icon... />` 형태로 컴포넌트화
```js:title=script/generate-icon-components.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GENERATED_DIR = path.join(__dirname, '../components/ui/icon/generated');
const OUTPUT_FILE = path.join(__dirname, '../components/ui/icon/IconComponents.tsx');

const files = fs.readdirSync(GENERATED_DIR);
const iconNames = files
  .filter((file) => file.endsWith('.tsx') && !file.startsWith('index'))
  .map((file) => file.replace('.tsx', ''));

const fileHeader = `import { Icon, IconProps } from './index';

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
	"svgr:icons": "svgr assets/icons --out-dir components/ui/icon/generated",
	"genSvgr:icons": "node scripts/generate-icon-components.mjs",
	"gen:icons": "npm run svgr:icons && npm run genSvgr:icons",
	//...
}
```


* * *

https://react-svgr.com/docs/next/


* * *

### TypeScript key값 타입 추출
```js
export type NAME = (typeof 배열)[number]['name'];
export type NAME = keyof typeof 객체
```




