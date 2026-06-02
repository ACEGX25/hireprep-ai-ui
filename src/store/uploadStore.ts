import { create } from "zustand";

interface UploadStore {
  file: File | null;
  jdText: string;
  setFile: (file: File) => void;
  setJdText: (text: string) => void;
  reset: () => void;
}

export const useUploadStore = create<UploadStore>((set) => ({
  file: null,
  jdText: "",
  setFile: (file) => set({ file }),
  setJdText: (text) => set({ jdText: text }),
  reset: () => set({ file: null, jdText: "" }),
}));