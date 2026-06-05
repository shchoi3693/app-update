import Search from '@/components/search/Search';
import Turntable from '@/components/turntable/Turntable';
import AlbumCoverList from '@/components/AlbumCoverList';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function Playlist() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/');
  return (
    <div>
      <Search userId={user.id} />
      <AlbumCoverList userId={user.id} />
      {/* <Turntable /> */}
    </div>
  );
}
