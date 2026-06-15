'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePlayerStore } from '@/store/usePlayerStore';
import TurntableBody from './TurntableBody';

export default function Turntable() {
  const activeTrack = usePlayerStore(state => state.activeTrack);
  const setActiveTrack = usePlayerStore(state => state.setActiveTrack);

  return (
    <AnimatePresence mode="wait">
      {activeTrack && (
        <motion.div
          className="fixed inset-0"
          style={{
            zIndex: 101,
          }}
        >
          <button className="h-10 w-10 cursor-pointer border" onClick={() => setActiveTrack(null)}>
            {'<'}
          </button>
          <p>{activeTrack.title}</p>

          <motion.div
            layoutId={`album-${activeTrack.id}`}
            layout
            className="absolute inset-0 z-201 my-auto"
            style={{
              width: '50%',
              height: 0,
              paddingTop: '50%',
              left: '6%',
              background: `linear-gradient(to right, ${activeTrack.palette?.vibrant}, ${activeTrack.palette?.darkVibrant})`,
            }}
            initial={{ rotate: 0 }}
            animate={{ rotate: -5 }}
            exit={{ rotate: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.6,
              ease: 'easeInOut',
              rotate: { delay: 0.9, duration: 0.5, ease: 'easeInOut' },
            }}
          />

          <TurntableBody />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
