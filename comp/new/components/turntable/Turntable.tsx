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

interface Props {
  track: PlaylistTrack | undefined;
  onClose: () => void;
}

export default function Turntable({ track, onClose }: Props) {
  console.log(track);
  return (
    <motion.div
      className="fixed inset-0 m-auto h-full w-full"
      style={{ zIndex: 101 }}
      transition={{ duration: 0.4, ease: 'circOut' }}
    >
      <motion.div
        layoutId={`album-${track?.id}`}
        className="fixed inset-0 my-auto h-80 w-80"
        style={{
          background: `linear-gradient(to right, ${track?.palette?.vibrant}, ${track?.palette?.darkVibrant})`,
        }}
      >
        <button onClick={() => onClose()}>{'<'}</button>
        <p>{track?.title}</p>
      </motion.div>
    </motion.div>
  );
}
