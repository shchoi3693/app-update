import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { logout } from './auth/actions';
import MainBnr from '@/components/MainBnr';

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-1 flex-col items-center justify-center font-sans">
      <main className="flex w-full max-w-3xl flex-1 flex-col">
        <MainBnr />
        {!user ? (
          <>
            <Link href="/login">Login</Link>
          </>
        ) : (
          <>
            <Link href="/playlist" className="bg-brand-500 w-full">
              Go
            </Link>
            <form action={logout}>
              <button type="submit" className="bg-brand-500 mt-5 w-full cursor-pointer">
                Logout
              </button>
            </form>
          </>
        )}
      </main>
    </div>
  );
}
