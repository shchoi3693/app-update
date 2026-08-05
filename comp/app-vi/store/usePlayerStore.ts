import { PlaylistTrack } from '@/types/playlist';
import { create } from 'zustand';

interface PlayerState {
  activeTrack: PlaylistTrack | null;
  setActiveTrack: (track: PlaylistTrack | null) => void;

  isPlaying: boolean;
  play: () => void;
  pause: () => void;
  //togglePlay: () => void;
}

export const usePlayerStore = create<PlayerState>(set => ({
  activeTrack: null,
  isPlaying: false,
  setActiveTrack: track => set({ activeTrack: track }),

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
}));
