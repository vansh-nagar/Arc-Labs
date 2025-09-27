import { create } from "zustand";


interface sidebarStore {
  currentPage: string;
  isSideBarOpen: boolean;
  setIsSideBarOpen: (isOpen: boolean) => void;
  setCurrentPage: (page: string) => void;
}

export const useSidebarStore = create<sidebarStore>((set) => ({
  currentPage: "Dashboard",
  isSideBarOpen: false,
  setIsSideBarOpen: (isOpen) => set({ isSideBarOpen: isOpen }),
  setCurrentPage: (page) => set({ currentPage: page }),
}));
