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
        <motion.div className="fixed inset-0 z-200">
          <button className="h-10 w-10 cursor-pointer border" onClick={() => setActiveTrack(null)}>
            {'<'}
          </button>
          <h2 className="text-sm">{activeTrack.title}</h2>

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
            <TurntableLp />
            <TurntablePin />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
