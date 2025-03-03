import { create } from 'zustand';

interface AppState {
  isLoading: boolean;
  darkMode: boolean;
  setLoading: (isLoading: boolean) => void;
  toggleDarkMode: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  isLoading: false,
  darkMode: false,
  setLoading: (isLoading) => set({ isLoading }),
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
})); 