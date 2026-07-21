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
  Variants,
} from 'framer-motion';

interface Props {
  query: string;
  tracks: Itunes[];
  onAddTrack: (track: Itunes) => void;
  isLoading: boolean;
}

const resultsVar = {
  initial: {},
  animate: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

const itemVar: Variants = {
  initial: { y: 20 },
  animate: { y: 0, transition: { type: 'spring', stiffness: 800, damping: 20 } },
  exit: { y: -30, transition: { type: 'spring', stiffness: 800, damping: 20 } },
};

const fadeVar = {
  initial: {},
  animate: { opacity: 1, transition: { duration: 0.1 } },
  exit: { transition: { duration: 0.15 } },
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
                  className="flex h-24 overflow-hidden border-t border-t-gray-200 p-2"
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
