---
date: '2026-05-06'
title: 'CSS Visual'
categories: ['Visual UI']
summary: 'css, css trick'
thumbnail: './gatsby-starter.jpg'
---

## Glass 효과

### SVG Filter
- svg는 레이어 순서 특성이 없어 선언 순서대로 쌓인다. (z-index 지정하더라도 적용되지 않음)
- `<defs>` (definitions) 내부에 선언 권장


```html
<svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'none' }}>
	<filter
		id="lensFilter"
		x="0%"
		y="0%"
		width="100%"
		height="100%"
		filterUnits="objectBoundingBox"
	>
		<feComponentTransfer in="SourceAlpha" result="alpha">
			<feFuncA type="identity" />
		</feComponentTransfer>

		<feGaussianBlur in="alpha" stdDeviation="60" result="blur" />

		<feDisplacementMap
			in="SourceGraphic"
			in2="blur"
			scale="60"
			xChannelSelector="A"
			yChannelSelector="A"
		/>
	</filter>
</svg>
```

```css
.bg-glass-filter:before {
	content: '';
	position: absolute;
	inset: 0;
	backdrop-filter: blur(4px);
	filter: url(#lensFilter) saturate(110%) brightness(1.15);
	border-radius: 40px;
	pointer-events: none;
}
```


```html
<div class="glass">
	<svg class="glass_mask" width="100%" height="100%" preserveAspectRatio="none">
		<mask id="frostyGlassMask"><rect width="100%" height="100%" fill="white" rx="12" ry="12" /></mask>
	</svg>
	<p>Contents</p>
</div>
```
```css
.glass{position:absolute;z-index:10;}
.glass:before{content:'';width:200%;height:200%;display:block;position:absolute;left:0%;top:0;backdrop-filter: blur(14px);mask-image:url(#frostyGlassMask);z-index:-1;pointer-events:none;}
.glass:after{content:'';position:absolute;inset:0;border-radius:12px;
	box-shadow:
		inset 1px 1px 0 0 #d8d9d9,
		inset -4px -4px 1px -4px #ffffff,
		inset -1px -1px 0 0 #a5a5a5cc,
		inset 1px 1px 5px 0 #adb9b966,
		inset -2px -6px 20px 0 rgba(0, 0, 0, 0.04),
		4px 4px 10px 0 rgba(0, 0, 0, 0.1);
	pointer-events:none;}
.glass_mask{position:absolute;inset:0;pointer-events:none;}
```

<div style="position:relative;height:130px;margin-top:40px;">
	<div class="glass" style="left:20px;top:20px;width:200px;padding:40px 20px;">
		<svg class="glass_mask" width="100%" height="100%" preserveAspectRatio="none">
			<mask id="frostyGlassMask"><rect width="100%" height="100%" fill="white" rx="12" ry="12" /></mask>
		</svg>
		<p>Contents</p>
	</div>
	<div style="position:absolute;left:236px;top:0;width:50px;height:50px;border-radius:50px;background:linear-gradient(45deg, #5e388d, #707fcb, #4063b7, #d2c3e5)"></div>
	<div style="position:absolute;left:264px;top:70px;width:50px;height:50px;border-radius:50px;background:linear-gradient(45deg, #5e388d, #707fcb, #4063b7, #d2c3e5)"></div>
</div>

<style>
.glass{position:absolute;z-index:10;}
.glass:before{content:'';width:200%;height:200%;display:block;position:absolute;left:0%;top:0;backdrop-filter: blur(14px);mask-image:url(#frostyGlassMask);z-index:-1;pointer-events:none;}
.glass:after{content:'';position:absolute;inset:0;border-radius:12px;box-shadow:inset 1px 1px 0 0 #d8d9d9, inset -4px -4px 1px -4px #ffffff, inset -1px -1px 0 0 #a5a5a5cc, inset 1px 1px 5px 0 #adb9b966, inset -2px -6px 20px 0 rgba(0, 0, 0, 0.04), 4px 4px 10px 0 rgba(0, 0, 0, 0.1);pointer-events:none;}
.glass_mask{position:absolute;inset:0;pointer-events:none;}
</style>


