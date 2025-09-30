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

export const useProjectData = create<any>((set) => ({
  permissionType: LinkPermissionType.VIEW,
  projectId: "",
  htmlContent: "",
  urlPermission: "",
  setHtmlContent: (html: string) => set({ htmlContent: html }),
  setProjectId: (id: string) => set({ projectId: id }),
  setPermissionType: (type: LinkPermissionType) =>
    set({ permissionType: type }),
  setUrlPermission: (url: string) => set({ urlPermission: url }),
}));
