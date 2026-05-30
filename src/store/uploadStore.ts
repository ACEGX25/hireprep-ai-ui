import { create } from "zustand";

interface UploadStore {
  file: File | null;
  jobUrl: string;
  setFile: (file: File) => void;
  setJobUrl: (url: string) => void;
  reset: () => void;
}

export const useUploadStore = create<UploadStore>((set) => ({
  file: null,
  jobUrl: "",
  setFile: (file) => set({ file }),
  setJobUrl: (url) => set({ jobUrl: url }),
  reset: () => set({ file: null, jobUrl: "" }),
}));