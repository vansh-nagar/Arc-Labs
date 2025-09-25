import { create } from "zustand";

interface sidebarStore {
  isSideBarOpen: boolean;
  setIsSideBarOpen: (isOpen: boolean) => void;
}

export const useSidebarStore = create<sidebarStore>((set) => ({
  isSideBarOpen: false,

  setIsSideBarOpen: (isOpen) => set({ isSideBarOpen: isOpen }),
}));
