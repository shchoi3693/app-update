'use client';

import { PlaylistTrack } from '@/types/playlist';
import {
  animate,
  motion,
  MotionValue,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from 'framer-motion';
import Image from 'next/image';
import { useEffect } from 'react';
import { usePlayerStore } from '@/store/usePlayerStore';

interface Props {
  track: PlaylistTrack;
  totalTracks: number;
  index: number;
  listHeight: number;
  y: MotionValue<number>;
  onTap: () => void;
}

export default function AlbumCover({ track, totalTracks, index, y, onTap, listHeight }: Props) {
  const targetScrollY = index * listHeight;
  const inputValues = [
    targetScrollY + listHeight * 2,
    targetScrollY + listHeight,
    targetScrollY, // Selected
    targetScrollY - listHeight * 2,
    targetScrollY - listHeight * 3,
    targetScrollY - listHeight * 4,
  ];

  const activeTrack = usePlayerStore(state => state.activeTrack);
  const setActiveTrack = usePlayerStore(state => state.setActiveTrack);

  const scale = useTransform(y, inputValues, [0.7, 0.8, 1, 0.8, 0.7, 0.6]);
  const trackIndex = totalTracks - index;
  const zIndex = useTransform(y, inputValues, [
    trackIndex,
    trackIndex,
    100,
    trackIndex,
    trackIndex,
    trackIndex,
  ]);
  const transformedX = useTransform(y, inputValues, [-40, -20, 50, 150, 200, 250]);
  const x = useMotionValue(transformedX.get());
  const indexWeight = useTransform(y, inputValues, [1, 2, 3, 4, 5, 6]);

  const isActiveTrack = activeTrack?.id === track?.id;

  useMotionValueEvent(transformedX, 'change', latest => {
    if (!activeTrack) {
      x.set(latest);
    }
  });
  useEffect(() => {
    const currentWeight = indexWeight.get();

    if (!activeTrack) {
      animate(x, transformedX.get(), {
        type: 'spring',
        stiffness: 100 + currentWeight * 10,
        damping: 24 - currentWeight,
      });
    } else if (!isActiveTrack) {
      animate(x, -400, {
        type: 'spring',
        stiffness: currentWeight * 40,
        damping: 22 - currentWeight,
      });
    }
  }, [activeTrack, isActiveTrack]);

  if (!track) return null;

  return (
    <motion.div
      //className="shrink-0"
      onTap={onTap}
      style={{
        scale,
        zIndex,
        x,
      }}
    >
      <motion.div
        layoutId={`album-${track.id}`}
        layout
        className="h-0 w-1/2 pt-[50%]"
        style={{
          background: `linear-gradient(to right, ${track.palette?.vibrant}, ${track.palette?.darkVibrant})`,
        }}
        transition={{ delay: 0.5, duration: 0.3, ease: 'easeInOut' }}
      >
        <div>
          <p className="text-sm">{track.album_name}</p>
          <button
            className="border border-gray-300 px-4"
            onClick={e => {
              e.stopPropagation();
              setActiveTrack(track);
            }}
          >
            Play
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
