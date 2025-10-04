import { create } from "zustand";

type HistoryState = {
  history: { code: string; time: number; changedDiv: string }[];
  currentIndex: number;
  addVersion: (code: string, changedDiv: string) => void;
  setIndex: (index: number) => void;
  resetHistory: () => void;
};

export const useHistoryStore = create<HistoryState>((set) => ({
  history: [],
  currentIndex: 0,

  addVersion: (code: string, changedDiv: string) =>
    set((state) => {
      const newHistory = [
        ...state.history.slice(0, state.currentIndex + 1), // discard future
        { code, time: Date.now(), changedDiv },
      ];
      console.log("Added version. New history length:", history);
      return {
        history: newHistory,
        currentIndex: newHistory.length - 1,
      };
    }),

  setIndex: (index: number) => set({ currentIndex: index }),

  resetHistory: () => set({ history: [], currentIndex: 0 }),
}));
