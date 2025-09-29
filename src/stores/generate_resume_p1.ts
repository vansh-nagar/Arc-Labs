import { create } from "zustand";

enum LinkPermissionType {
  VIEW,
  EDIT,
  LOCKED,
}

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

export const useHTMLEditorStore = create<any>((set) => ({
  htmlContent: "",
  setHtmlContent: (html: string) => set({ htmlContent: html }),
}));

export const usePermissionStore = create<any>((set) => ({
  permissionType: LinkPermissionType.VIEW,
  setPermissionType: (type: LinkPermissionType) =>
    set({ permissionType: type }),
}));
