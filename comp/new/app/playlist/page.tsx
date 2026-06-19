import Search from '@/components/search/Search';
import TabBar from '@/components/TabBar';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import TrackList from '@/components/track/TrackList';
import Turntable from '@/components/turntable/Turntable';
import { Suspense } from 'react';
import Skeleton from '@/components/ui/Skeleton';

export default async function Playlist() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/');

  return (
    <div className="fixed inset-0 overflow-hidden">
      <Search userId={user.id} />
      <div className="absolute inset-0 z-100 mb-[20vh]">
        {/* <Suspense fallback={<TrackListSkeleton />}>
        </Suspense> */}
        <TrackList userId={user.id} />
        <Turntable />
      </div>

      <TabBar />
    </div>
  );
}
