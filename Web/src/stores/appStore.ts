import { create } from 'zustand';

interface AppState {
  isLoading: boolean;
  darkMode: boolean;
  setLoading: (isLoading: boolean) => void;
  toggleDarkMode: () => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (value: boolean) => void;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  isLoading: false,
  darkMode: false,
  setLoading: (isLoading) => set({ isLoading }),
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

  isSidebarCollapsed: false,
  setIsSidebarCollapsed: (value: boolean) => {
    set({ isSidebarCollapsed: value });
  },
  toggleSidebar: () => {
    set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed }));
  },
}));

