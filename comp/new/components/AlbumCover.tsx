'use client';

import { PlaylistTrack } from '@/types/playlist';
import { motion, MotionValue, useTransform, Variants } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState, MouseEvent } from 'react';

interface Props {
  track: PlaylistTrack | undefined;
  totalTracks: number;
  index: number;
  y: MotionValue<number>;
  onClick: () => void;
  onOpen: () => void;
}

export default function AlbumCover({ track, totalTracks, index, y, onClick, onOpen }: Props) {
  const albumSize = 160;
  const centerRange = index * albumSize;
  const scale = useTransform(
    y,
    [centerRange - albumSize, centerRange, centerRange + albumSize],
    [0.7, 1, 0.8],
  );
  const trackIndex = totalTracks - index;
  const zIndex = useTransform(
    y,
    [centerRange - albumSize, centerRange, centerRange + albumSize],
    [trackIndex, 100, trackIndex],
  );
  const x = useTransform(
    y,
    [centerRange - albumSize, centerRange, centerRange + albumSize],
    [150, 100, 50],
  );

  const handlerTrackOpen = (e: MouseEvent) => {
    e.stopPropagation();
    onOpen();
  };
  console.log(centerRange);

  return (
    <motion.div
      className="h-40 w-40 shrink-0 origin-center"
      onClick={onClick}
      style={{
        scale,
        zIndex,
        x,
        background: `linear-gradient(to right, ${track?.palette?.vibrant}, ${track?.palette?.darkVibrant})`,
      }}
      // animate={!isOpen ? { zIndex: trackIndex } : { scale: 2, zIndex: 100 }}
      // style={!isOpen ? { scale, zIndex } : { x: 0 }} -rotate-45
      layoutId={`album-${track?.id}`}
    >
      <p className="text-sm">{track?.album_name}</p>
      <button className="border border-gray-300 px-4" onClick={handlerTrackOpen}>
        Go
      </button>
    </motion.div>
  );
}
