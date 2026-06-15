'use client';

import { usePlayerStore } from '@/store/usePlayerStore';
import { motion, useMotionValue } from 'framer-motion';
import { useRef } from 'react';
import TurntablePin from './TurntablePin';

export default function TurntableBody() {
  const activeTrack = usePlayerStore(state => state.activeTrack);
  //const coverWrapper = useRef<HTMLDivElement>(null);

  if (!activeTrack) return;
  return (
    <motion.div
      className="absolute inset-0 left-auto z-200 my-auto overflow-hidden bg-amber-100"
      style={{
        width: '50%',
        height: 0,
        paddingTop: '50%',
      }}
      initial={{ right: '-100%' }}
      animate={{ right: 0 }}
      exit={{ right: '-100%' }}
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
          delay: 1.8,
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
  );
}
