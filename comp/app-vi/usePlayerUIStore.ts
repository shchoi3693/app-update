import { create } from 'zustand';

interface PlayerUIState {
  isSearchOpen: boolean;

  openSearch: () => void;
  closeSearch: () => void;
}

export const usePlayerUIStore = create<PlayerUIState>(set => ({
  isSearchOpen: false,
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
}));
