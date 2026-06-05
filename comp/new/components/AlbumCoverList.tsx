'use client';

import { usePlaylist } from '@/hooks/usePlaylist';
import { usePlaylistTrack } from '@/hooks/useTrack';
import { animate, AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
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
  const [openTrackId, setOpenTrackId] = useState<string | null>(null);
  const y = useMotionValue(0);

  const albumSize = 160;

  if (isPlaylistLoading) return <div>P Loading</div>;
  if (isPlaylistError || isTracksError) return <>Error</>;
  if (isTracksLoading) return <>T Loading</>;
  if (!tracks || tracks.length === 0) return <>0 Plyalist</>;

  const maxDrag = (tracks.length - 1) * albumSize;
  const centerItem = (index: number) => {
    animate(y, albumSize * index, {
      type: 'spring',
      stiffness: 200,
      damping: 20,
      mass: 0.8,
    });
  };

  return (
    <div className="absolute inset-0 overflow-hidden border border-gray-300">
      <div className="absolute inset-0 my-[20vw]">
        {/* -rotate-45  my-auto*/}
        <motion.div
          drag="y"
          className="absolute inset-0 m-auto flex cursor-grab flex-col-reverse"
          //  flex-col items-center rotate-45
          style={{ y }}
          //dragConstraints={containerRef}
          //dragElastic={1}
          dragConstraints={{ top: 0, bottom: maxDrag }}
          dragElastic={0.2}
        >
          {tracks.map((track, index) => (
            <AlbumCover
              key={track.id}
              totalTracks={tracks.length}
              track={track}
              index={index}
              y={y}
              onClick={() => centerItem(index)}
              onOpen={() => setOpenTrackId(track.id)}
            />
          ))}
        </motion.div>

        <AnimatePresence>
          {openTrackId && (
            <Turntable
              track={tracks.find(t => t.id === openTrackId)!}
              onClose={() => setOpenTrackId(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
