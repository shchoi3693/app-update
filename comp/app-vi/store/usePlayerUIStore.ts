import { create } from 'zustand';

interface PlayerUIState {
  isSearchOpen: boolean;
  tracksLength: number;
  selectedTrackIndex: number;

  openSearch: () => void;
  closeSearch: () => void;
  setTracksLength: (length: number) => void;
  setSelectedTrackIndex: (index: number) => void;
  trackNext: () => void;
  trackPrev: () => void;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export const usePlayerUIStore = create<PlayerUIState>((set, get) => ({
  isSearchOpen: false,
  tracksLength: 0,
  selectedTrackIndex: 0,

  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
  setTracksLength: length => set({ tracksLength: length }),
  setSelectedTrackIndex: index =>
    set(state => ({ selectedTrackIndex: clamp(index, 0, Math.max(state.tracksLength - 1, 0)) })),
  trackNext: () => {
    const { selectedTrackIndex, setSelectedTrackIndex } = get();
    setSelectedTrackIndex(selectedTrackIndex + 1);
  },
  trackPrev: () => {
    const { selectedTrackIndex, setSelectedTrackIndex } = get();
    setSelectedTrackIndex(selectedTrackIndex - 1);
  },
}));
