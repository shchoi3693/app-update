'use client';

import { logout } from '@/app/auth/actions';
import { usePlayerStore } from '@/store/usePlayerStore';

export default function TabBar() {
  const setActiveTrack = usePlayerStore(state => state.setActiveTrack);
  return (
    <>
      <div className="absolute inset-3 top-auto z-202 flex h-12 rounded-full mix-blend-difference">
        <div className="flex flex-1 justify-center">
          <div
            className="inline-flex h-full cursor-pointer items-center rounded-full px-4"
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
                  fill="#d1d5dc"
                  fillRule="evenodd"
                />
              </svg>
            </i>
            <p className="text-mix ml-2 text-gray-300">Playlist</p>
          </div>
        </div>
        <div className="flex w-20 items-center justify-center">
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
                fill="#d1d5dc"
                fillRule="evenodd"
              />
            </svg>
          </i>
        </div>
      </div>

      {/* Background: Glass */}
      <div className="bg-glass-shadow pointer-events-none absolute inset-3 top-auto z-201 h-12"></div>
      <div className="bg-glass-filter pointer-events-none absolute inset-3 top-auto z-200 h-12">
        <svg xmlns="http://www.w3.org/2000/svg">
          <filter
            id="lensFilter"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            filterUnits="objectBoundingBox"
          >
            <feComponentTransfer in="SourceAlpha" result="alpha">
              <feFuncA type="identity" />
            </feComponentTransfer>

            <feGaussianBlur in="alpha" stdDeviation="60" result="blur" />

            <feDisplacementMap
              in="SourceGraphic"
              in2="blur"
              scale="60"
              xChannelSelector="A"
              yChannelSelector="A"
            />
          </filter>
        </svg>
      </div>
    </>
  );
}
