import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

//google 인증 마치고 여기 서버로 redirect (auth/callback?code=XXXX)
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url); // origin: redirect 주소
  const code = searchParams.get('code'); // XXXX
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code); // access token + refresh token 교환, 쿠키 저장
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
