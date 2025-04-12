import { create } from 'zustand'

interface State {
    isSideMenuOpen: boolean;
    openSideMenu: () => void;
    closeSidemenu: () => void;
}

export const useUIStore = create<State>()((set) => ({
    isSideMenuOpen: false,
    openSideMenu: () => set({ isSideMenuOpen: true }),
    closeSidemenu: () => set({ isSideMenuOpen: false }),
}));