import { file } from "zod";
import { create } from "zustand";

interface optionstore {
  selectedOption: number;
  setSelectedOption: (option: number) => void;
}

export const optionsStore = create<optionstore>((set) => ({
  selectedOption: 0,
  setSelectedOption: (option: number) => set({ selectedOption: option }),
}));
interface generateResumeData {
  file: File | null;
  jobDescription: string;
  setFile: (file: File | null) => void;
  setJobDescription: (jobDescription: string) => void;
  jobTitle: string;
  setJobTitle: (jobTitle: string) => void;
}

export const generateResumeDataStore = create<generateResumeData>((set) => ({
  file: null,
  jobDescription: "",
  jobTitle: "",
  setJobDescription: (jobDescription: string) => {
    set({ jobDescription });
    console.log(jobDescription);
  },
  setJobTitle: (jobTitle: string) => {
    set({ jobTitle });
    console.log(jobTitle);
  },
  setFile: (file: File | null) => set({ file }),
}));
