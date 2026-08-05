'use client';

import { useRemoveTrackOpt } from '@/hooks/useTrack';
import { usePlayerStore } from '@/store/usePlayerStore';
import { usePlayerUIStore } from '@/store/usePlayerUIStore';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Link from 'next/link';

import { div } from 'framer-motion/client';
import GlassButton from './ui/GlassButton';
import GlassBg from './ui/GlassBg';

export default function TabBar() {
  const activeTrack = usePlayerStore(state => state.activeTrack);
  const setActiveTrack = usePlayerStore(state => state.setActiveTrack);
  const openSearch = usePlayerUIStore(state => state.openSearch);
  const { mutate: removeTrack, isPending } = useRemoveTrackOpt();

  const trackNext = usePlayerUIStore(state => state.trackNext);
  const trackPrev = usePlayerUIStore(state => state.trackPrev);

  const tabVar: Variants = {
    initial: { y: -10, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 10, opacity: 0 },
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {!activeTrack ? (
        <motion.div
          key="defaultTab"
          variants={tabVar}
          initial="initial"
          animate="animate"
          exit="exit"
          className="absolute inset-3 top-auto mx-auto flex max-w-md justify-between gap-8"
        >
          <GlassBg className="p-1">
            <div className="flex gap-2">
              <GlassButton onClick={trackPrev} className="h-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  height="24"
                  width="24"
                >
                  <g id="skip-previous">
                    <path
                      id="Union"
                      fill="#99a1af"
                      d="M5 4.5c0.55228 0 1 0.44772 1 1v13c0 0.5523 -0.44772 1 -1 1s-1 -0.4477 -1 -1v-13c0 -0.55228 0.44772 -1 1 -1m11.9102 1.16602C18.2407 4.80119 20 5.7559 20 7.34277v9.31443c0 1.5869 -1.7593 2.5416 -3.0898 1.6768l-7.16508 -4.6572c-1.21336 -0.7887 -1.21337 -2.5649 0 -3.3536zM10.835 12 18 16.6572V7.34277z"
                      strokeWidth="1"
                    ></path>
                  </g>
                </svg>
              </GlassButton>
              <GlassButton onClick={trackNext} className="h-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  height="24"
                  width="24"
                >
                  <g id="chevron-double-right">
                    <path
                      id="Union"
                      fill="#99a1af"
                      d="M10.5869 4.08972c0.3571 -0.16194 0.7761 -0.10084 1.0713 0.15723l8.001 6.99995c0.2169 0.1899 0.3408 0.4647 0.3408 0.753 0 0.2882 -0.124 0.563 -0.3408 0.7529l-8.001 7c-0.2952 0.2581 -0.7141 0.3192 -1.0713 0.1572 -0.3573 -0.1621 -0.5869 -0.5178 -0.5869 -0.9101V17.08l-3.375 2.7011c-0.30012 0.2401 -0.71216 0.2866 -1.05859 0.1201C5.22012 19.7347 5 19.3842 5 18.9999V4.99988c0.00005 -0.38425 0.22015 -0.73481 0.56641 -0.90137 0.34641 -0.16637 0.7585 -0.11996 1.05859 0.12012L10 6.91882V4.99988c0 -0.39231 0.2297 -0.74802 0.5869 -0.91016M7 16.9178l3.375 -2.6992c0.3001 -0.24 0.7122 -0.2866 1.0586 -0.1201 0.3461 0.1666 0.5664 0.5172 0.5664 0.9014v1.7959l5.4805 -4.7959L12 7.203v1.79688c0 0.38417 -0.2203 0.73472 -0.5664 0.90137 -0.3464 0.16645 -0.7584 0.11995 -1.0586 -0.12012L7 7.08093z"
                      strokeWidth="1"
                    ></path>
                  </g>
                </svg>
              </GlassButton>
            </div>
          </GlassBg>

          <GlassBg className="p-1">
            <GlassButton onClick={openSearch} className="h-10">
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
            </GlassButton>
          </GlassBg>
        </motion.div>
      ) : (
        <motion.div
          key="playerTab"
          variants={tabVar}
          initial="initial"
          animate="animate"
          exit="exit"
          className="absolute inset-3 top-auto mx-auto flex max-w-md justify-between gap-8"
        >
          <GlassBg className="p-1">
            <GlassButton onClick={() => setActiveTrack(null)} className="h-10">
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
              <p className="ml-2 text-gray-200">Playlist</p>
            </GlassButton>
          </GlassBg>

          <GlassBg className="p-1">
            <GlassButton
              className="h-10"
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
            </GlassButton>
          </GlassBg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
