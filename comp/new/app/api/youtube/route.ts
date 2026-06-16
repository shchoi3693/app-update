import { NextResponse } from 'next/server';

const API_KEY = process.env.YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3/search';

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get('q');

  if (!q) {
    return NextResponse.json({ error: 'Query is required' }, { status: 400 });
  }
  if (!API_KEY) {
    throw new Error('Youtube Key Error');
  }

  try {
    const params = new URLSearchParams({
      part: 'snippet',
      q,
      order: 'viewCount',
      maxResults: '1',
      type: 'video',
      videoEmbeddable: 'true',
      key: API_KEY,
    });
    const res = await fetch(`${BASE_URL}?${params.toString()}`, { next: { revalidate: 3600 } });
    if (!res.ok) {
      return NextResponse.json({ error: 'YouTube API error' }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data.items[0] || {});
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
