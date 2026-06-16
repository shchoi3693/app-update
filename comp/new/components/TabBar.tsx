'use client';

import { logout } from '@/app/auth/actions';
import { usePlayerStore } from '@/store/usePlayerStore';

export default function TabBar() {
  const setActiveTrack = usePlayerStore(state => state.setActiveTrack);
  return (
    <div className="fixed inset-4 top-auto z-100 flex h-14 rounded-full border border-gray-300 p-1">
      <div
        className="h-full flex-1 cursor-pointer rounded-full bg-gray-50"
        onClick={() => setActiveTrack(null)}
      >
        <i className="inline-block h-6 w-6">
          <svg
            fill="none"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-full"
          >
            <path
              d="M14.5 13.5V5.41a1 1 0 0 0-.3-.7L9.8.29A1 1 0 0 0 9.08 0H1.5v13.5A2.5 2.5 0 0 0 4 16h8a2.5 2.5 0 0 0 2.5-2.5m-1.5 0v-7H8v-5H3v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1M9.5 5V2.12L12.38 5zM5.13 5h-.62v1.25h2.12V5zm-.62 3h7.12v1.25H4.5zm.62 3h-.62v1.25h7.12V11z"
              clipRule="evenodd"
              fill="#666"
              fillRule="evenodd"
            />
          </svg>
        </i>
        <p>Playlist</p>
      </div>
      <div className="h-full flex-1 cursor-pointer rounded-full bg-gray-50">
        <form action={logout} className="h-full w-full">
          <button type="submit">Logout</button>
        </form>
      </div>
    </div>
  );
}
