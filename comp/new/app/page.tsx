import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import MainBnr from '@/components/MainBnr';
import Playlist from '@/app/playlist/page';

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-1 flex-col items-center justify-center font-sans">
      <main className="flex w-full max-w-3xl flex-1 flex-col">
        {!user ? (
          <>
            <MainBnr />
            <Link href="/login">Login</Link>
          </>
        ) : (
          <Playlist userId={user.id} />
        )}
      </main>
    </div>
  );
}
