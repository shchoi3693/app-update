'use client';

import { useState } from 'react';
import SearchInput from './SearchInput';
import SearchResult from './SearchResult';
import { useSearchTracks } from '@/hooks/useSearch';
import { useAddTrack, usePlaylistTrack } from '@/hooks/useTrack';
import { Itunes } from '@/types/itunes';
import { usePlayerUIStore } from '@/store/usePlayerUIStore';
import { AnimatePresence, motion, stagger, Variants } from 'framer-motion';
import { usePlaylist } from '@/hooks/usePlaylist';
import { toast } from 'sonner';

export default function Search({ userId }: { userId: string }) {
  const { data: playlists } = usePlaylist(userId);
  const playlistId = playlists?.[0]?.id || null;
  const { data: pTracks } = usePlaylistTrack({ userId: userId, playlistId: playlistId });
  const [query, setQuery] = useState('');
  const { data, isLoading } = useSearchTracks(query);
  const tracks = data?.results || [];
  const { mutate: addTrack, isPending, error } = useAddTrack();

  const isSearchOpen = usePlayerUIStore(state => state.isSearchOpen);

  //if (isLoading) return <>user Loading</>;

  const handlerReset = () => setQuery('');

  const handlerAddTrack = (track: Itunes) => {
    const isDuplicate = pTracks?.some(t => t.itunes_id === track.trackId) ?? false;

    if (isDuplicate) {
      toast.error('이미 추가');
      return;
    }
    addTrack({ userId, track });
  };

  const searchVar: Variants = {
    initial: {
      y: 200,
      opacity: 0,
    },
    animate: {
      x: 0,
      y: 0,
      opacity: 1,
    },
    exit: {
      opacity: 0,
      transition: {
        type: 'tween',
        duration: 0.2,
        ease: 'easeIn',
      },
    },
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {isSearchOpen && (
        <motion.div
          variants={searchVar}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ type: 'tween', duration: 0.2, ease: 'easeOut' }}
          className="absolute inset-0 z-300 bg-gray-200/80"
        >
          <SearchInput
            value={query}
            onChange={e => setQuery(e.target.value)}
            onReset={handlerReset}
          />
          <SearchResult
            query={query}
            tracks={tracks}
            isLoading={isLoading}
            onAddTrack={handlerAddTrack}
            isPending={isPending}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
