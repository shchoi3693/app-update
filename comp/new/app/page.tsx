import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import MainBnr from '@/components/MainBnr';
import { redirect } from 'next/navigation';
import { trackService } from '@/services/trackService';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect('/playlist');

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['main_playlist', 'tracks'],
    queryFn: () => trackService.getMainPlaylistTracks(),
  });

  return (
    <div className="flex flex-1 flex-col items-center justify-center font-sans">
      <main className="flex w-full max-w-3xl flex-1 flex-col">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <MainBnr />
        </HydrationBoundary>
        <Link href="/login">Login</Link>
      </main>
    </div>
  );
}
