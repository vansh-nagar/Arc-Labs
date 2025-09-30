import { create } from "zustand";

interface optionstore {
  selectedOption: number;
  setSelectedOption: (option: number) => void;
}

export const optionsStore = create<optionstore>((set) => ({
  selectedOption: 0,
  setSelectedOption: (option: number) => set({ selectedOption: option }),
}));

export const generateResumeDataStore = create<any>((set) => ({
  type: "",
  data: {},
  setType: (type: string) => set({ type }),
  setData: (data: any) => {
    set({ data });
  },
}));
