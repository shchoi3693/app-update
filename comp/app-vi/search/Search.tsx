'use client';

import { useState } from 'react';
import SearchInput from './SearchInput';
import SearchResult from './SearchResult';
import { useSearchTracks } from '@/hooks/useSearch';
import { useAddTrack } from '@/hooks/useTrack';
import { Itunes } from '@/types/itunes';
import { usePlayerStore } from '@/store/usePlayerStore';

export default function Search({ userId }: { userId: string }) {
  const [query, setQuery] = useState('');
  const { data, isLoading } = useSearchTracks(query);
  const tracks = data?.results || [];
  const { mutate: addTrack, isPending: isAddTrackPending } = useAddTrack();
  const [videoId, setVideoId] = useState<string>('');

  const activeTrack = usePlayerStore(state => state.activeTrack);

  //if (isLoading) return <>user Loading</>;
  const handlerReset = () => setQuery('');
  const handlerAddTrack = (track: Itunes) => {
    addTrack(
      { userId, track },
      {
        onSuccess: data => {
          setVideoId(data.youtube_video_id);
        },
      },
    );
  };

  if (isAddTrackPending) return <>pending</>;

  if (!activeTrack)
    return (
      <div className="absolute top-0 right-0 left-0 z-300 bg-white/60">
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
        />
      </div>
    );
}
