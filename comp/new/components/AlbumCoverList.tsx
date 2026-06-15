'use client';

import { usePlaylist } from '@/hooks/usePlaylist';
import { usePlaylistTrack } from '@/hooks/useTrack';
import { animate, motion, useMotionValue } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import AlbumCover from './AlbumCover';
import Turntable from './turntable/Turntable';

export default function AlbumCoverList({ userId }: { userId: string }) {
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
  } = usePlaylistTrack({ user_id: userId, playlist_id: playlistId });

  const containerY = useRef<HTMLDivElement>(null);
  const [listHeight, setListHeight] = useState(160);

  useEffect(() => {
    if (!containerY.current) return;
    const { width } = containerY.current.getBoundingClientRect();
    setListHeight(width * 0.5);
  }, [tracks]);

  const y = useMotionValue(0);
  const selectedItem = useCallback(
    (index: number) => () => {
      animate(y, listHeight * index, {
        type: 'spring',
        stiffness: 200,
        damping: 20,
        mass: 0.8,
      });
    },
    [y, listHeight],
  );
  if (isPlaylistLoading) return <div>P Loading</div>;
  if (isPlaylistError || isTracksError) return <>Error</>;
  if (isTracksLoading) return <>T Loading</>;
  if (!tracks || tracks.length === 0) return <>0 Plyalist</>;

  const maxDrag = (tracks.length - 1) * listHeight;

  return (
    <div className="fixed inset-0 overflow-hidden border border-gray-300">
      <div className="absolute inset-0 mb-[20vh]">
        <motion.div
          ref={containerY}
          drag="y"
          className="absolute inset-0 m-auto flex cursor-grab flex-col-reverse"
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
              onTap={selectedItem(index)}
              listHeight={listHeight}
            />
          ))}
        </motion.div>

        <Turntable />
      </div>
    </div>
  );
}
