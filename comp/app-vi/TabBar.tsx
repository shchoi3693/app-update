'use client';

import { useRemoveTrackOpt } from '@/hooks/useTrack';
import { usePlayerStore } from '@/store/usePlayerStore';
import { usePlayerUIStore } from '@/store/usePlayerUIStore';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Link from 'next/link';

export default function TabBar() {
  const activeTrack = usePlayerStore(state => state.activeTrack);
  const setActiveTrack = usePlayerStore(state => state.setActiveTrack);
  const openSearch = usePlayerUIStore(state => state.openSearch);
  const { mutate: removeTrack, isPending } = useRemoveTrackOpt();

  const tabVar: Variants = {
    initial: { y: 10, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 10, opacity: 0 },
  };
  //console.log(user);

  return (
    <>
      <div className="absolute inset-3 top-auto bottom-5 z-202 mx-auto max-w-xs mix-blend-difference">
        <AnimatePresence mode="wait" initial={false}>
          {!activeTrack ? (
            <motion.div
              key="defaultTab"
              variants={tabVar}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex h-12 p-1"
            >
              {/* <div
                className="flex flex-1 cursor-pointer items-center justify-center rounded-full px-4"
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
                      fill="#99a1af"
                      fillRule="evenodd"
                    />
                  </svg>
                </i>
                <Link href="/" className="text-mix ml-2 text-gray-400">
                  Home
                </Link>
              </div> */}
              <div
                className="flex w-14 cursor-pointer items-center justify-center rounded-full bg-neutral-900/50"
                onClick={openSearch}
              >
                <i className="inline-block h-6 w-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    height="24"
                    width="24"
                  >
                    <g>
                      <path
                        fill="#99a1af"
                        d="M11 2c4.9706 0 9 4.02944 9 9 0 2.125 -0.7381 4.0766 -1.9697 5.6162l4.1767 4.1768 -1.414 1.414 -4.1768 -4.1767C15.0766 19.2619 13.125 20 11 20c-4.97056 0 -9 -4.0294 -9 -9 0 -4.97056 4.02944 -9 9 -9m0 2c-3.86599 0 -7 3.13401 -7 7 0 3.866 3.13401 7 7 7 3.866 0 7 -3.134 7 -7 0 -3.86599 -3.134 -7 -7 -7"
                        strokeWidth="1"
                      ></path>
                    </g>
                  </svg>
                </i>
              </div>
            </motion.div>
          ) : (
            <>
              <motion.div
                key="playerTab2"
                variants={tabVar}
                initial="initial"
                animate="animate"
                exit="exit"
                className="mb-10 flex h-12 items-center justify-center gap-4"
                transition={{ type: 'tween', duration: 0.2, ease: 'easeOut' }}
              >
                <div
                  className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border"
                  onClick={() => console.log(1)}
                >
                  {'<'}
                </div>
                <div
                  className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border px-4"
                  onClick={() => console.log(2)}
                >
                  <i className="inline-block h-6 w-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      height="24"
                      width="24"
                    >
                      <g>
                        <path
                          fill="#d1d5dc"
                          d="M7.51855 4.12297c0.3199 -0.17556 0.71069 -0.16266 1.01856 0.0332L19.5371 11.1562c0.2883 0.1835 0.4628 0.502 0.4629 0.8437 0 0.3419 -0.1746 0.6602 -0.4629 0.8438l-10.99999 7c-0.30792 0.1959 -0.69861 0.2088 -1.01856 0.0332C7.19869 19.7012 7 19.3649 7 18.9999V4.99992c0.00008 -0.36488 0.1987 -0.70135 0.51855 -0.87695M9 17.1777l8.1367 -5.1778L9 6.82121z"
                        ></path>
                      </g>
                    </svg>
                  </i>
                </div>
                <div
                  className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border"
                  onClick={() => console.log(3)}
                >
                  {'>'}
                </div>
              </motion.div>
              <motion.div
                key="playerTab"
                variants={tabVar}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex h-12 p-1"
              >
                <div
                  className="flex flex-1 cursor-pointer items-center justify-center rounded-full px-4"
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
                        fill="#99a1af"
                        fillRule="evenodd"
                      />
                    </svg>
                  </i>
                  <p>Playlist</p>
                </div>
                <div
                  className="flex w-14 cursor-pointer items-center justify-center rounded-full bg-neutral-900/50"
                  onClick={() => {
                    removeTrack({
                      userId: activeTrack.user_id,
                      playlistId: activeTrack.playlist_id,
                      playlistTrackId: activeTrack.id,
                    });
                    setActiveTrack(null);
                  }}
                >
                  <i className="inline-block h-6 w-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 48 48"
                      height="24"
                      width="24"
                    >
                      <g id="recycle-bin-2--remove-delete-empty-bin-trash-garbage">
                        <path
                          id="Subtract"
                          stroke="#99a1af"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6.182 15.842c0.887 13.815 1.736 21.002 2.24 24.423 0.256 1.73 1.392 3.14 3.093 3.548C13.83 44.37 17.817 45 24.002 45c6.185 0 10.171 -0.63 12.487 -1.186 1.7 -0.408 2.836 -1.818 3.092 -3.548 0.505 -3.422 1.353 -10.609 2.24 -24.427"
                          strokeWidth="3"
                        ></path>
                        <path
                          stroke="#99a1af"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M31.036 7.176c3.56 0.066 6.334 0.174 8.322 0.275 2.39 0.12 4.61 1.393 5.278 3.691 0.1 0.345 0.194 0.71 0.276 1.097 0.394 1.84 -0.983 3.421 -2.858 3.58 -3.02 0.255 -8.547 0.545 -18.077 0.545 -9.529 0 -15.057 -0.29 -18.076 -0.545 -1.876 -0.158 -3.261 -1.75 -2.776 -3.568 0.175 -0.655 0.39 -1.253 0.616 -1.784 0.813 -1.903 2.77 -2.885 4.836 -2.999 1.908 -0.104 4.685 -0.222 8.387 -0.292A7 7 0 0 1 23.37 3h1.262a7 7 0 0 1 6.405 4.176Z"
                          strokeWidth="3"
                        ></path>
                        <path
                          stroke="#99a1af"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m18 25 1 10"
                          strokeWidth="3"
                        ></path>
                        <path
                          stroke="#99a1af"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m30 25 -1 10"
                          strokeWidth="3"
                        ></path>
                      </g>
                    </svg>
                  </i>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Background: Glass */}
      <div className="bg-glass-shadow pointer-events-none absolute inset-3 top-auto bottom-5 z-201 mx-auto h-12 max-w-xs"></div>
      <div className="bg-glass-filter pointer-events-none absolute inset-3 top-auto bottom-5 z-200 mx-auto h-12 max-w-xs">
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
