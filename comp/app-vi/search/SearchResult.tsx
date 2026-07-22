'use client';

import Image from 'next/image';
import { Itunes } from '@/types/itunes';

import { AnimatePresence, motion, stagger, Variants } from 'framer-motion';

interface Props {
  query: string;
  tracks: Itunes[];
  onAddTrack: (track: Itunes) => void;
  isLoading: boolean;
}

const stateBoxVar = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const resultsVar = {
  initial: {},
  animate: {
    transition: { delayChildren: stagger(0.08) },
  },
};

const itemVar: Variants = {
  initial: { y: 10 },
  animate: {
    y: 0,
    transition: { type: 'spring', stiffness: 200, damping: 20 },
  },
  exit: { y: 0, transition: { duration: 0.1 } },
};
const albumVar: Variants = {
  initial: { y: 20 },
  animate: (i: number) => ({
    y: 0,
    rotate: i % 2 === 0 ? -4 : 4,
    transition: {
      y: { delay: i * 0.1, type: 'spring', stiffness: 200, damping: 15 },
      rotate: {
        delay: i * 0.1 + 0.3,
        duration: 0.2,
      },
    },
  }),
};

export default function SearchResult({ query, tracks, onAddTrack, isLoading }: Props) {
  const state = isLoading
    ? 'loading'
    : tracks.length === 0 && query.length > 1
      ? 'empty'
      : tracks.length > 0
        ? 'results'
        : 'idle';

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        {state === 'loading' && (
          <motion.div
            key="loading"
            variants={stateBoxVar}
            initial="initial"
            animate="animate"
            exit="exit"
            className="mt-14 py-10 text-center"
          >
            Search Loading
          </motion.div>
        )}

        {state === 'empty' && (
          <motion.div
            key="empty"
            variants={stateBoxVar}
            initial="initial"
            animate="animate"
            exit="exit"
            className="mt-14 py-10 text-center"
          >
            data 0
          </motion.div>
        )}

        {state === 'results' && (
          <motion.ul
            key={query}
            variants={resultsVar}
            initial="initial"
            animate="animate"
            exit="exit"
            className="scrollbar-hide mt-0 max-h-full overflow-y-auto px-2 pb-4"
          >
            {tracks.map((track, i) => {
              return (
                <motion.li
                  key={track.trackId}
                  variants={itemVar}
                  className="flex gap-x-4 overflow-hidden pl-2 first-of-type:mt-14"
                >
                  <div className="flex h-20 items-center pt-3">
                    <motion.div
                      variants={albumVar}
                      custom={i}
                      className="relative my-auto h-24 w-24 overflow-hidden rounded-md border border-gray-200 bg-amber-100"
                    >
                      {/* <Image fill src={track.artworkUrl100} alt={track.trackName} unoptimized /> */}
                    </motion.div>
                  </div>
                  <div className="flex flex-1 border-b border-b-gray-200 pt-4 pb-3">
                    <div className="flex-1">
                      <p className="text-md mt-auto">{track.trackName}</p>
                      <p className="mt-1 text-sm text-gray-500">{track.artistName}</p>
                    </div>
                    <button
                      type="button"
                      title="리스트 추가"
                      onClick={() => onAddTrack(track)}
                      className="h-8 w-8 cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                        fill="none"
                        className="rounded-full border border-white bg-white/50"
                      >
                        <path
                          d="M16 8 L16 24"
                          stroke="#6a7282"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M8 16 L24 16"
                          stroke="#6a7282"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </motion.li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </>
  );
}
