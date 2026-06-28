import { NextResponse } from 'next/server';

const BASE_URL = 'https://itunes.apple.com/search';

export async function GET(request: Request) {
  const term = new URL(request.url).searchParams.get('term');

  if (!term) {
    return NextResponse.json({ error: 'Term is required' }, { status: 400 });
  }

  try {
    const params = new URLSearchParams({
      term,
      entity: 'song',
      limit: '10',
    });
    const res = await fetch(`${BASE_URL}?${params}`, { next: { revalidate: 3600 } });
    if (!res.ok) {
      return NextResponse.json({ error: 'iTunes API error' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
