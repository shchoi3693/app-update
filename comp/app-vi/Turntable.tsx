'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePlayerStore } from '@/store/usePlayerStore';
import TurntableCover from './TurntableCover';
import TurntablePin from './TurntablePin';
import TurntableLp from './TurntableLp';

export default function Turntable() {
  const activeTrack = usePlayerStore(state => state.activeTrack);
  const setActiveTrack = usePlayerStore(state => state.setActiveTrack);

  return (
    <AnimatePresence mode="wait">
      {activeTrack && (
        <motion.div className="fixed inset-0">
          <motion.button
            initial={{ x: 10, opacity: 0 }}
            animate={{
              x: 0,
              opacity: 1,
              transition: {
                type: 'spring',
                stiffness: 100,
                damping: 25,
                delay: 0.3,
              },
            }}
            exit={{
              opacity: 0,
              // transition: {
              //   delay: 0,
              // },
            }}
            className="h-10 w-10 cursor-pointer border"
            onClick={() => setActiveTrack(null)}
          >
            {'<'}
          </motion.button>

          <TurntableCover />
          <motion.div
            className="absolute inset-0 left-auto my-auto aspect-square w-1/2 overflow-hidden"
            initial={{ right: '-100%' }}
            animate={{
              right: 0,
              transition: {
                type: 'spring',
                stiffness: 100,
                damping: 25,
                delay: 0.6,
              },
            }}
            exit={{
              right: '-100%',
              transition: {
                delay: 0.3,
              },
            }}
          >
            {/* <TurntableLp />
            <TurntablePin /> */}
          </motion.div>
          <motion.div
            className="absolute bottom-30 left-10"
            initial={{ y: 20, opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              transition: {
                type: 'spring',
                stiffness: 100,
                damping: 25,
                delay: 0.3,
              },
            }}
            exit={{
              opacity: 0,
              // transition: {
              //   delay: 0,
              // },
            }}
          >
            {/* <h2 className="text-2xl">{activeTrack.title}</h2>
            <p className="text-md">{activeTrack.artist_name}</p> */}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
