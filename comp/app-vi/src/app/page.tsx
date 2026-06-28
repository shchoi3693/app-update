import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
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

  if (user) redirect('/playlist');

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(trackQueries.mainPlaylist());

  return (
    <div className="flex flex-1 flex-col items-center justify-center font-sans">
      <main className="flex w-full max-w-3xl flex-1 flex-col">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <QueryAsyncBoundary pendingFallback={<SkeletonSwiper />}>
            <MainBnr />
          </QueryAsyncBoundary>
        </HydrationBoundary>
        <Link href="/login">Login</Link>
      </main>
    </div>
  );
}
