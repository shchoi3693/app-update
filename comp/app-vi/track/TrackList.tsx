'use client';

import { usePlaylist } from '@/hooks/usePlaylist';
import { usePlaylistTrack } from '@/hooks/useTrack';
import { animate, motion, useMotionValue } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import AlbumCover from './AlbumCover';
import { useMeasure } from '@/hooks/useMeasure';
import { useRouter } from 'next/navigation';
import { usePlayerUIStore } from '@/store/usePlayerUIStore';

export default function TrackList({ userId }: { userId: string }) {
  const {
    data: playlists,
    isLoading: isPlaylistLoading,
    isError: isPlaylistError,
  } = usePlaylist(userId);
  const playlistId = playlists?.[0]?.id || null;
  const {
    data: tracks,
    isLoading: isTracksLoading,
    isError: isTracksError,
  } = usePlaylistTrack({ userId: userId, playlistId: playlistId });
  const router = useRouter();

  const [maxDrag, setMaxDrag] = useState(0);
  const { ref, width } = useMeasure();
  const listHeight = Math.round(width * 0.5);

  const y = useMotionValue(0);

  const tracksLength = usePlayerUIStore(state => state.tracksLength);
  const setTracksLength = usePlayerUIStore(state => state.setTracksLength);
  const selectedTrackIndex = usePlayerUIStore(state => state.selectedTrackIndex);
  const setSelectedTrackIndex = usePlayerUIStore(state => state.setSelectedTrackIndex);

  const handleTracks = useCallback(
    (index: number) => () => {
      setSelectedTrackIndex(index);
    },
    [setSelectedTrackIndex],
  );

  useEffect(() => {
    animate(y, listHeight * selectedTrackIndex, {
      type: 'spring',
      stiffness: 200,
      damping: 20,
      mass: 0.8,
    });
  }, [y, listHeight, selectedTrackIndex]);

  useEffect(() => {
    if (!tracks || tracks.length === 0) return;

    setTracksLength(tracks.length);

    const newMaxDrag = (tracks.length - 1) * listHeight;
    setMaxDrag(newMaxDrag);
    if (newMaxDrag < y.get()) {
      y.set(newMaxDrag);
    }
  }, [tracks, listHeight, setTracksLength, setMaxDrag]);

  if (isPlaylistLoading || isTracksLoading) return <div>track Loading</div>;

  if (isPlaylistError || isTracksError)
    return (
      <div className="flex h-full items-center justify-center">
        <button
          className="cursor-pointer border border-gray-200 px-6 py-2.5"
          onClick={() => router.refresh()}
        >
          다시 시도
        </button>
      </div>
    );

  if (!tracks || tracks.length === 0) return <>0 Plyalist</>;

  return (
    <motion.div
      ref={ref}
      drag="y"
      className="absolute inset-0 m-auto mb-[18vh] flex max-w-md cursor-grab flex-col-reverse"
      style={{ y }}
      dragConstraints={{ top: 0, bottom: maxDrag }}
      dragElastic={0.2}
    >
      {tracks.map((track, index) => (
        <AlbumCover
          key={track.id}
          track={track}
          totalTracks={tracks.length}
          index={index}
          y={y}
          onTap={handleTracks(index)}
          listHeight={listHeight}
        />
      ))}
    </motion.div>
  );
}
