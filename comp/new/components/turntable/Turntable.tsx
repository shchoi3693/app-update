'use client';

import {
  animate,
  AnimatePresence,
  motion,
  PanInfo,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';

import { PlaylistTrack } from '@/types/playlist';
import { usePlayerStore } from '@/store/usePlayerStore';

export default function Turntable() {
  const activeTrack = usePlayerStore(state => state.activeTrack);
  const setActiveTrack = usePlayerStore(state => state.setActiveTrack);
  //console.log(`album-${track?.id}`);
  return (
    <AnimatePresence>
      {activeTrack && (
        <motion.div
          className="fixed inset-0"
          style={{
            zIndex: 101,
            //        background: `linear-gradient(to right, ${track?.palette?.vibrant}, ${track?.palette?.darkVibrant})`,
          }}
        >
          <button className="h-10 w-10 cursor-pointer border" onClick={() => setActiveTrack(null)}>
            {'<'}
          </button>
          <p>{activeTrack.title}</p>
          <motion.div
            layoutId={`album-${activeTrack.id}`}
            className="absolute inset-0 -left-10 my-auto h-80 w-80"
            style={{
              background: `linear-gradient(to right, ${activeTrack.palette?.vibrant}, ${activeTrack.palette?.darkVibrant})`,
              opacity: 0.4,
            }}
            transition={{ duration: 0.3, ease: 'circOut' }}
          ></motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
