---
date: '2026-06-04'
title: 'Turntable'
categories: ['Design']
summary: ''
thumbnail: './img1.jpg'
---

> 턴 앱을 만들며

## 로그인, 회원가입(/supabase/#Next 16 + Supabase Auth)


## 이미지 최적화 [node-vibrant](https://github.com/Vibrant-Colors/node-vibrant)
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

## 축 Interacte
- `Math.atan2(y, x)` : 0 ~ PI 값 &rightarrow; deg 값 `180 / Math.PI` 
```tsx
const currentAngle = Math.floor(
  // atan2(현재 포인트 좌표 - 기준 축)
  (Math.atan2(currentY - pivotY, currentX - pivotX) * 180) / Math.PI,
);
```

- Framer Motion [onPan] 사용
- [useSpring]
- `PanInfo` 사용하여 현재 포인트 좌표 값 가져오기
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