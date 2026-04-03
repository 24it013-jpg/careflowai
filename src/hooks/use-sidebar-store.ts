import { create } from "zustand";

interface SidebarStore {
    isOpen: boolean;
    toggle: () => void;
    setIsOpen: (open: boolean) => void;
}

export const useSidebarStore = create<SidebarStore>((set) => ({
    isOpen: true, // Default to open on desktop
    toggle: () => set((state) => ({ isOpen: !state.isOpen })),
    setIsOpen: (isOpen) => set({ isOpen }),
}));
