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
  const transformedX = useTransform(y, inputValues, [0, 100, 150, 200, 250, 300]);
  const x = useMotionValue(transformedX.get());
  const transformedIndex = useTransform(y, inputValues, [1, 2, 3, 4, 5, 6]);

  const isActiveTrack = activeTrack?.id === track?.id;

  useMotionValueEvent(transformedX, 'change', latest => {
    if (!activeTrack) {
      x.set(latest);
    }
  });
  useEffect(() => {
    const indexValue = transformedIndex.get();

    if (!activeTrack) {
      animate(x, transformedX.get(), {
        type: 'spring',
        stiffness: 100 + indexValue * 10,
        damping: 24 - indexValue,
      });
    } else if (!isActiveTrack) {
      animate(x, -400, {
        type: 'spring',
        stiffness: indexValue * 40,
        damping: 22 - indexValue,
      });
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
    >
      <motion.div
        layoutId={`album-${track.id}`}
        style={{
          width: 180,
          height: 180,
          rotate: 0,
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
          Play
        </button>
      </motion.div>
    </motion.div>
  );
}
