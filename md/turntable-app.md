---
date: '2026-06-20'
title: 'Turntable Music'
categories: ['Visual UI']
summary: '사이드 프로젝트로 플레이리스트 웹앱 디자인과 Framer Motion 사용하기'
thumbnail: './img1.jpg'
---

## 디자인
> 애플의 [WWDC25](https://developer.apple.com/videos/play/wwdc2025/359/) 참고  
> 구조 &rightarrow; 내비게이션 &rightarrow; 콘텐츠 &rightarrow; 비주얼 디자인

### 구조
- 명확성  
 - 어디에 있는지 : 상단 타이틀
 - 무엇을 할 수있는지 : 검색 버튼, 로그아웃 버튼
 - 어디로 갈 수 있는지 : 하단 탭바
- 정보 구조 설계 : 앱이 하는 모든 기능 정리 &rightarrow; 정리  
  - 로그인, 회원가입
  - 메인 (첫 진입 화면)
  - 플레이리스트  
    - Track 삭제
  - 플레이
  - 검색  
    - Track 추가

### 내비게이션
- 다른 섹션 탐색  
  - 플레이리스트, 검색
- 2개 ~ 최대 4개 동일한 너비
- input 키보드로 일시적으로 가려질 수 있는 영역

### 콘텐츠
- 가장 중요하게 생각하는 것, 기대하는 것 안내
- 정돈된 리스트 정렬 방법  
  - 시간 : 최근 파일, 계절성 &rightarrow; 여름에 듣기 좋은 레코드
  - 진행 상태 : 임시 저장, 이어서 보기
  - 패턴 : 연관 상품 &rightarrow; 장르별 레코드

### 비주얼 디자인
- 시각적 위계
- 텍스트 가독성 : 앨범커버에 이미지 그라데이션 블러 추가

## 로그인, 회원가입 
- Next [Supabase](/supabase/#Next 16 + Supabase Auth)의 Auth

## 이미지 색상추출 [node-vibrant](https://github.com/Vibrant-Colors/node-vibrant)
- 이미지 블러로 백그라운드 처리를 하면 성능 부하가 심해져 패드나 모바일 디바이스에서 끊김
- 플레이리스트 추가 시 앨범 커버 색상 값 같이 저장

### Browser 빌드
- `img` `canvas`로 로드해서 픽셀로 색상 추출
```ts
import { Vibrant } from 'node-vibrant/browser';
const palette = await Vibrant.from(url).getPalette();
```

### Node 빌드
- DOM이 없어 별도의 디코딩 라이브러리로 색상 추출
- 서버가 직접 fetch하기 때문에 CORS 무관
```ts:title=src/app/api/palette/route.ts
import { NextResponse } from 'next/server';
import { Vibrant } from 'node-vibrant/node';

export async function GET(request: Request) {
  const url = new URL(request.url).searchParams.get('url');
  if (!url) return NextResponse.json({ error: 'URL Error' }, { status: 400 });
  try {
    const palette = await Vibrant.from(url).getPalette();

    // 메서드(palette Swatch) JSON 변환되면 사라지기 때문에 필요한 hex값만 추출
    return NextResponse.json({
      vibrant: palette.Vibrant?.hex,
      muted: palette.Muted?.hex,
      darkVibrant: palette.DarkVibrant?.hex,
      lightVibrant: palette.LightVibrant?.hex,
      darkMuted: palette.DarkMuted?.hex,
      lightMuted: palette.LightMuted?.hex,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
```
### 사용 예시
```ts:title=src/app/hooks/useTrack.ts
return useMutation({
	mutationFn: async ({ userId, track }: { userId: string; track: Itunes }) => {

    // Browser 빌드 시
    const palette = await Vibrant.from(track.artworkUrl100).getPalette();
    return trackService.addTrackToPlaylist({
      userId,
      newTrack:{
        ...
        palette: {
          vibrant: palette.Vibrant?.hex,
          muted: palette.Muted?.hex,
          darkVibrant: palette.DarkVibrant?.hex,
          lightVibrant: palette.LightVibrant?.hex,
          darkMuted: palette.DarkMuted?.hex,
          lightMuted: palette.LightMuted?.hex,
        },
      }
    })

    // Node 빌드 시
    const paletteRes = await fetch(`/api/palette?url=${encodeURIComponent(track.artworkUrl100)}`);
    if(!paletteRes.ok) throw new Error('vibrant error');
    const palette = await paletteRes.json();

    return trackService.addTrackToPlaylist({
      userId,
      newTrack: {
        ...
        palette
      }
    })
	}
})
```
```ts
export default function Componenet({track}: Props){
  style={{
    background: `linear-gradient(to right, ${track.palette?.darkVibrant}, ${track.palette?.darkMuted})`,
  }}
}
```

## PlayList Framer Motion
### 앨범커버 리스트
- 드래그 Y축 고정
- `onClick` 대신 `onTap` 사용하여 드래그와 클릭 시(탭) motion 구분
- `useCallback` 사용하여 `y, listHeight` 변경시만 리렌더링

```tsx
const [maxDrag, setMaxDrag] = useState(0);
const { ref, width } = useMeasure();
const listHeight = Math.round(width * 0.5);

const y = useMotionValue(0);
const selectedItem = useCallback(
  (index: number) => () => {
    animate(y, listHeight * index, {
      type: 'spring',
      stiffness: 200,
      damping: 20,
      mass: 0.8,
    });
  },
  [y, listHeight],
);

useEffect(() => {
  if (!tracks || tracks.length === 0) return;

  setMaxDrag((tracks.length - 1) * listHeight);
  if (maxDrag < y.get()) {
    y.set(maxDrag);
  }
}, [tracks, listHeight]);

...
<motion.div
  drag="y"
  className="absolute inset-0 m-auto flex max-w-md cursor-grab flex-col-reverse"
  style={{ y }}
  dragConstraints={{ top: 0, bottom: maxDrag }}
  dragElastic={0.2}
>
  {tracks.map((track, index) => (
    <AlbumCover
      key={track.id}
      track={track}
      totalTracks={tracks.length}
      index={index}
      y={y}
      onTap={selectedItem(index)} // 중앙에 위치한 앨범 커버
      listHeight={listHeight}
    />
  ))}
</motion.div>
...
```

### 앨범커버 Motion
- [`useMotionValueEvent(motionValue, 이벤트, 콜백)`](/framer-motion/)
```tsx
export default function AlbumCover({ track, totalTracks, index, y, onTap, listHeight }: Props) {
  const targetScrollY = index * listHeight;
  const inputValues = [
    targetScrollY + listHeight * 2,
    targetScrollY + listHeight,
    targetScrollY, // 중앙에 위치한 앨범 커버
    targetScrollY - listHeight * 2,
    targetScrollY - listHeight * 3,
    targetScrollY - listHeight * 4,
  ];

  // 변환 값 : useTransform(y, [y 상태 값], [y 맵핑 후 변환 값])
  const scale = useTransform(y, inputValues, [0.7, 0.8, 1, 0.8, 0.7, 0.6]);
  // const zIndex = useTransform(y, inputValues.slice(0, 4), [trackIndex, trackIndex, 100, trackIndex]);
  // 되도록 slice 사용 지양 (맵핑 갯수 동일하게 사용 : 실수 방지)
  const zIndex = useTransform(y, inputValues, [
    trackIndex,
    trackIndex,
    100,
    trackIndex,
    trackIndex,
    trackIndex,
  ]);
  const transformedX = useTransform(y, inputValues, [-40, -20, 50, 150, 200, 250]);
  const x = useMotionValue(transformedX.get());
  const indexWeight = useTransform(y, inputValues, [1, 2, 3, 4, 5, 6]);

  // 선택한 앨범 커버
  const isActiveTrack = activeTrack?.id === track?.id;

  // transformedX 값(y) 변경 시 마다 실행
  useMotionValueEvent(transformedX, 'change', latest => {
    if (!activeTrack) {
      x.set(latest);
    }
  });
  useEffect(() => {
    const currentWeight = indexWeight.get();

    if (!activeTrack) {
      animate(x, transformedX.get(), {
        type: 'spring',
        stiffness: 100 + currentWeight * 10,
        damping: 24 - currentWeight,
      });
    } else if (!isActiveTrack) {
      animate(x, -400, {
        type: 'spring',
        stiffness: currentWeight * 40,
        damping: 22 - currentWeight,
      });
    }
  }, [activeTrack, isActiveTrack]);

...
  <motion.div
    className="shrink-0"
    onTap={onTap}
    style={{
      scale,
      zIndex,
      x,
    }}
  >
    <motion.div
      layoutId={`album-${track.id}`}
      layout
      style={{
        width: '50%',
        height: 0,
        paddingTop: '50%',
        background: `linear-gradient(to right, ${track.palette?.vibrant}, ${track.palette?.darkVibrant})`,
      }}
    >
...
}
```

### 턴테이블 핀
- Framer Motion [onPan](/framer-motion/props) 사용
- `PanInfo` 사용하여 현재 포인트 좌표(current) 값 가져오기
- 각도 계산  
  - `Math.atan2(y, x)` 0 ~ PI 값 &rightarrow; `180 / Math.PI` deg 값으로 변환
```tsx
Math.floor(
  // atan2(현재 포인트 좌표(current) - 기준 축(pivot))
  (Math.atan2(currentY - pivotY, currentX - pivotX) * 180) / Math.PI,
);
```
```tsx
const pinWrapper = useRef<HTMLDivElement>(null);
const rotateRaw = useMotionValue(0);
const rotate = useSpring(rotateRaw, { stiffness: 500, damping: 30 });

const startAngle = useRef(0);
const pivotX = useRef(0);
const pivotY = useRef(0);
const getAngle = (x: number, y: number) =>
  Math.floor((Math.atan2(y - pivotY.current, x - pivotX.current) * 180) / Math.PI);

const handlePinStart = (event: PointerEvent, info: PanInfo) => {
  if (!pinWrapper.current) return;

  const rect = pinWrapper.current.getBoundingClientRect();
  pivotX.current = rect.left + rect.width / 2;
  pivotY.current = rect.top;

  startAngle.current = getAngle(info.point.x, info.point.y) - rotateRaw.get();
};

const handlePin = (event: PointerEvent, info: PanInfo) => {
  if (!pinWrapper.current) return;

  let deg = getAngle(info.point.x, info.point.y) - startAngle.current;
  deg = Math.max(0, Math.min(30, deg));
  rotateRaw.set(deg);
};
```

## 앨범커버 `listHeight` 반응형
> [ResizeObserver](/web-api/)로 리스트의 width 사이즈 비례하여 조정
- 새로운 Hook 생성 (useMeasure.ts)
- DOM 요소(ref) 생성 후 width 사이즈 가져오는 함수 실행
- `ref` 연결 방법  
  - 객체 연결 : `useRef` 렌더링 끝난 후 { current }에 연결 (조건부 없음)
  - 콜백 함수 연결 : 렌더링 될 때마다 실행 방지 위해 `useCallback` 사용

```ts:title=src/hooks/useMeasure.ts
import { useCallback, useRef, useState } from 'react';

interface Dimensions {
  width: number;
  height: number;
  // top: number;
  // left: number;
  // x: number;
  // y: number;
}

export function useMeasure<T extends HTMLDivElement>() {
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 0,
    height: 0,
    // top: 0,
    // left: 0,
    // x: 0,
    // y: 0,
  });

  const observerRef = useRef<ResizeObserver | null>(null);
  const ref = useCallback((node: T | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (node !== null) {
      const resizeObserver = new ResizeObserver(entries => {
        entries.forEach(entry => {
          setDimensions({ width: entry.contentRect.width, height: entry.contentRect.height });
        });
      });
      resizeObserver.observe(node);
      observerRef.current = resizeObserver;
    }
    return () => {
      if (observerRef.current) {
        console.log('observe 해제');
        observerRef.current.disconnect();
      }
    };
  }, []);

  return { ref, ...dimensions };
}
```

* * * 

```sql
ALTER TABLE playlist_tracks
ADD COLUMN IF NOT EXISTS palette JSONB;
```
```ts
export interface PlaylistTrack {
  ...
  palette: {
    vibrant?: string;
    muted?: string;
    darkVibrant?: string;
    darkMuted?: string;
    lightVibrant?: string;
    lightMuted?: string;
  } | null;
  youtube_video_id: string;
  ...
}
```

```ts:title=src/hooks/useTrack.ts
mutationFn: async ({ userId, track }: { userId: string; track: Itunes }) => {
  const searchQuery = `${track.trackName} ${track.artistName} official`;

  const [ytbResult, paletteResult] = await Promise.allSettled([
    fetch(`/api/youtube?q=${encodeURIComponent(searchQuery)}`).then((res) => {
      if (!res.ok) throw new Error('Youtube Api Fetch error');
      return res.json();
    }),
    fetch(`/api/palette?url=${encodeURIComponent(track.artworkUrl100)}`).then((res) => {
      if (!res.ok) throw new Error('Vibrant Api Fetch error');
      return res.json();
    }),
  ]);

  const ytbId = ytbResult.status === 'fulfilled' ? ytbResult.value.id?.videoId : undefined;
  const palette = paletteResult.status === 'fulfilled' ? paletteResult.value : null;

  return trackService.addTrackToPlaylist({
    userId,
    newTrack: {
      album_name: track.collectionName,
      artist_name: track.artistName,
      title: track.trackName,
      image_url: track.artworkUrl100,
      palette,
      youtube_video_id: ytbId,
    },
  });
},
```

* * *
- 디자인  
  - https://brunch.co.kr/@hnjnkm/58
