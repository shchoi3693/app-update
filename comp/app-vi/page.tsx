import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { logout } from '@/app/auth/actions';
import MainBnr from '@/components/MainBnr';
import { redirect } from 'next/navigation';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import QueryAsyncBoundary from '@/components/QueryAsyncBoundary';
import { trackQueries } from '@/hooks/useTrack';
import SkeletonSwiper from '@/components/ui/SkeletonSwiper';

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(trackQueries.mainPlaylist());

  if (!user) {
    redirect('/login');
  } else {
    redirect('/playlist');
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center font-sans">
      <main className="flex w-full max-w-3xl flex-1 flex-col">
        <div className="mt-10">
          <HydrationBoundary state={dehydrate(queryClient)}>
            <QueryAsyncBoundary pendingFallback={<SkeletonSwiper />}>
              <MainBnr />
            </QueryAsyncBoundary>
          </HydrationBoundary>
        </div>
        <div className="bg-glass-tab">
          {!user ? (
            <Link href="/login">Login</Link>
          ) : (
            <div className="align-center flex max-w-sm">
              <Link href="/playlist" className="btn-brand flex-1 rounded-full">
                Playlist
              </Link>
              <form className="" action={logout}>
                <button type="submit" className="btn-glass cursor-pointer">
                  Logout
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
