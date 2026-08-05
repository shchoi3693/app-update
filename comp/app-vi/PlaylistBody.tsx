'use client';

import TabBar from '@/components/TabBar';
import TrackList from '@/components/track/TrackList';
import Turntable from '@/components/turntable/Turntable';
import { usePlayerStore } from '@/store/usePlayerStore';
import { animate, motion, useMotionValue } from 'framer-motion';
import { useEffect } from 'react';

export default function PlaylistBody({ userId }: { userId: string }) {
  const DEFAULT_BG_COLOR = '#ffffff';
  const trackColor = usePlayerStore(
    state => state.activeTrack?.palette?.lightMuted ?? DEFAULT_BG_COLOR,
  );
  const bgColor = useMotionValue(trackColor);
  useEffect(() => {
    const controls = animate(bgColor, trackColor, {
      duration: 0.6,
      ease: 'easeInOut',
    });
    return () => controls.stop();
  }, [trackColor, bgColor]);

  return (
    <motion.div
      className="absolute inset-0"
      style={{ backgroundColor: bgColor }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ease: 'easeInOut' }}
    >
      <TrackList userId={userId} />
      <Turntable />
      <TabBar />
    </motion.div>
  );
}
