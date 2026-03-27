import { create } from "zustand";

interface AIChatStore {
    isOpen: boolean;
    initialMessage: string;
    openChat: (message?: string) => void;
    closeChat: () => void;
    setIsOpen: (open: boolean) => void;
}

export const useAIChat = create<AIChatStore>((set) => ({
    isOpen: false,
    initialMessage: "",
    openChat: (message = "") => set({ isOpen: true, initialMessage: message }),
    closeChat: () => set({ isOpen: false, initialMessage: "" }),
    setIsOpen: (isOpen) => set({ isOpen }),
}));
