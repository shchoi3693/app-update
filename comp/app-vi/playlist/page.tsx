import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Search from '@/components/search/Search';
import PlaylistBody from '@/components/PlaylistBody';

export default async function Playlist() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/');

  return (
    <div className="fixed inset-0 overflow-hidden">
      <Search userId={user.id} />
      <PlaylistBody userId={user.id} />
    </div>
  );
}
