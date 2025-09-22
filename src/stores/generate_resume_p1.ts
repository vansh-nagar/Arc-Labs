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
  data: {},
  setData: (data: any) => {
    set({ data });
  },
}));

export const useHTMLEditorStore = create<any>((set) => ({
  htmlContent: "",
  setHtmlContent: (html: string) => set({ htmlContent: html }),
}));
