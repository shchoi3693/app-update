'use client';

import Image from 'next/image';
import { Itunes } from '@/types/itunes';

import {
  animate,
  AnimatePresence,
  easeIn,
  motion,
  MotionValue,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from 'framer-motion';

interface Props {
  query: string;
  tracks: Itunes[];
  onAddTrack: (track: Itunes) => void;
  isLoading: boolean;
}

const resultsVar = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { delayChildren: 0.02, staggerChildren: 0.08 },
  },
};

const itemVar = {
  initial: { y: 20 },
  animate: { y: 0, transition: { duration: 0.2 } },
  exit: { y: -10, transition: { duration: 0.2 } },
};

const fadeVar = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.1 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export default function SearchResult({ query, tracks, onAddTrack, isLoading }: Props) {
  //if (isLoading) return ;

  const state = isLoading
    ? 'loading'
    : tracks.length === 0 && query.length > 1
      ? 'empty'
      : tracks.length > 0
        ? 'results'
        : 'idle';

  return (
    <div className="mt-1">
      <AnimatePresence mode="wait" initial={false}>
        {state === 'loading' && (
          <motion.div
            key="loading"
            variants={fadeVar}
            initial="initial"
            animate="animate"
            exit="exit"
            className="mt-1 py-10 text-center"
          >
            Search Loading
          </motion.div>
        )}

        {state === 'empty' && (
          <motion.div
            key="empty"
            variants={fadeVar}
            initial="initial"
            animate="animate"
            exit="exit"
            className="mt-1 py-10 text-center"
          >
            data 0
          </motion.div>
        )}

        {state === 'results' && (
          <motion.ul key={query} variants={resultsVar} initial="initial" animate="animate">
            {tracks.map(track => {
              return (
                <motion.li
                  key={track.trackId}
                  className="flex h-20 overflow-hidden border-t border-t-gray-200"
                  onClick={() => onAddTrack(track)}
                >
                  <motion.div
                    variants={itemVar}
                    className="relative h-20 w-20 shrink-0 bg-amber-100"
                  ></motion.div>
                  <div className="px-3 py-2">
                    <p className="text-sm">{track.trackName}</p>
                    <p className="mt-2 text-sm">{track.artistName}</p>
                  </div>
                </motion.li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
