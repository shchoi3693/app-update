'use client';

import { AnimatePresence, motion, useMotionValue } from 'framer-motion';
import { usePlayerStore } from '@/store/usePlayerStore';
import TurntablePin from './TurntablePin';
import { useRef } from 'react';
import TurntableCover from './TurntableCover';

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

          {/* <TurntableCover /> */}
          <motion.div
            layoutId={`album-${activeTrack.id}`}
            className="absolute inset-0 left-[5%] z-201 my-auto"
            style={{
              width: '50%',
              height: 0,
              paddingTop: '50%',
              //rotate: '-5deg',
              background: `linear-gradient(to right, ${activeTrack.palette?.vibrant}, ${activeTrack.palette?.darkVibrant})`,
            }}
            //initial={{ opacity: 1, width: 200, height: 200, transform: 'rotate(0deg)' }}
            // animate={{ transform: 'rotate(-5deg)' }}
            // exit={{ transform: 'rotate(-5deg)' }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          />

          {/* <motion.div
            className="absolute inset-0 right-auto my-auto"
            style={{
              width: '70%',
              height: '70%',
              background: `linear-gradient(to right, ${activeTrack.palette?.vibrant}, ${activeTrack.palette?.darkVibrant})`,
            }}
          /> */}

          <motion.div
            className="absolute inset-0 left-auto z-200 my-auto overflow-hidden bg-amber-100"
            style={{
              width: '50%',
              height: 0,
              paddingTop: '50%',
            }}
            initial={{ right: '-100%' }}
            animate={{ right: 0 }}
            transition={{
              type: 'spring',
              stiffness: 100,
              damping: 25,
              delay: 0.8,
            }}
          >
            <motion.div
              className="absolute inset-0 m-auto"
              style={{
                width: '70%',
                height: '70%',
                background: `linear-gradient(to right, #ddd, #ddd)`,
              }}
              initial={{ left: '-170%' }}
              animate={{ left: 0 }}
              transition={{
                type: 'spring',
                stiffness: 100,
                damping: 25,
                delay: 1.6,
              }}
            >
              <motion.div
                className="absolute inset-0 m-auto"
                style={{
                  width: '50%',
                  height: '50%',
                  background: `linear-gradient(to right, ${activeTrack.palette?.vibrant}, ${activeTrack.palette?.darkVibrant})`,
                }}
              />
            </motion.div>
            <TurntablePin />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
