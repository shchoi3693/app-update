'use client';

import Image from 'next/image';
import { Itunes } from '@/types/itunes';

interface Props {
  query: string;
  tracks: Itunes[];
  onAddTrack: (track: Itunes) => void;
  isLoading: boolean;
}

export default function SearchResult({ query, tracks, onAddTrack, isLoading }: Props) {
  if (isLoading) return <div>Search Loading</div>;
  return (
    <div className="p-2">
      {tracks &&
        (tracks.length === 0 && query.length > 1 ? (
          <div>data 0</div>
        ) : (
          <ul>
            {tracks.map(track => {
              return (
                <li
                  key={track.trackId}
                  className="flex border border-gray-200"
                  onClick={() => onAddTrack(track)}
                >
                  <div className="relative shrink-0 w-10 h-10 border border-gray-200">
                    <Image fill src={track.artworkUrl100} alt={track.trackName} unoptimized />
                  </div>
                  <div className="flex">
                    <p className="text-sm p-3">{track.trackName}</p>
                    <p className="text-sm p-3">{track.artistName}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        ))}
    </div>
  );
}
