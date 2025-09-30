import { create } from "zustand";
export enum LinkPermissionType {
  VIEW = "VIEW",
  EDIT = "EDIT",
  LOCKED = "LOCKED",
}

type ProjectDataState = {
  projectId: string;
  htmlContent: string;
  urlPermission: LinkPermissionType;
  isOwner?: boolean;

  setHtmlContent: (html: string) => void;
  setProjectId: (id: string) => void;
  setUrlPermission: (permission: LinkPermissionType) => void;
  setIsOwner: (isOwner: boolean) => void;
};

export const useProjectData = create<ProjectDataState>((set) => ({
  projectId: "",
  htmlContent: "",
  urlPermission: LinkPermissionType.VIEW,
  specialPermissionUsers: [],
  isOwner: false,

  setHtmlContent: (html) => set({ htmlContent: html }),
  setProjectId: (id) => set({ projectId: id }),
  setUrlPermission: (permission) => set({ urlPermission: permission }),
  setIsOwner: (isOwner) => set({ isOwner }),
}));
