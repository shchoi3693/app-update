'use client';

import { PlaylistTrack } from '@/types/playlist';
import {
  animate,
  motion,
  MotionValue,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  Variants,
} from 'framer-motion';
import Image from 'next/image';
import { MouseEvent, useEffect } from 'react';
import { usePlayerStore } from '@/store/usePlayerStore';

interface Props {
  track: PlaylistTrack;
  totalTracks: number;
  index: number;
  y: MotionValue<number>;
  onTap: () => void;
}

export default function AlbumCover({ track, totalTracks, index, y, onTap }: Props) {
  const listHeight = 160;
  const targetScrollY = index * listHeight;
  const inputValues = [
    targetScrollY + listHeight,
    targetScrollY, // Selected
    targetScrollY - listHeight * 2,
    targetScrollY - listHeight * 3,
    targetScrollY - listHeight * 4,
    targetScrollY - listHeight * 5,
  ];

  const activeTrack = usePlayerStore(state => state.activeTrack);
  const setActiveTrack = usePlayerStore(state => state.setActiveTrack);

  const scale = useTransform(y, inputValues, [0.7, 1, 0.8, 0.7, 0.6, 0.6]);

  const trackIndex = totalTracks - index;
  const zIndex = useTransform(y, inputValues.slice(0, 3), [trackIndex, 100, trackIndex]);

  const isActiveTrack = activeTrack?.id === track?.id;
  const transformedX = useTransform(y, inputValues, [0, 100, 150, 200, 250, 300]);
  const x = useMotionValue(transformedX.get());

  useMotionValueEvent(transformedX, 'change', latest => {
    if (!activeTrack) {
      x.set(latest);
    }
  });
  useEffect(() => {
    if (!activeTrack) {
      animate(x, transformedX.get(), { type: 'spring', stiffness: 150, damping: 20 + index * 2 });
    } else if (!isActiveTrack) {
      animate(x, -500, { type: 'spring', stiffness: 100, damping: 25 });
    }
  }, [activeTrack, isActiveTrack]);

  if (!track) return null;

  return (
    <motion.div
      className="h-40 shrink-0"
      onTap={onTap}
      style={{
        scale,
        zIndex,
        x,
      }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        layoutId={`album-${track.id}`}
        className="h-50 w-50"
        style={{
          background: `linear-gradient(to right, ${track.palette?.vibrant}, ${track.palette?.darkVibrant})`,
        }}
      >
        <p className="text-sm">{track.album_name}</p>
        <button
          className="border border-gray-300 px-4"
          onClick={e => {
            e.stopPropagation();
            setActiveTrack(track);
          }}
        >
          Go
        </button>
      </motion.div>
    </motion.div>
  );
}
