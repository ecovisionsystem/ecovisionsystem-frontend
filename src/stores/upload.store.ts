import { create } from "zustand";
import type { UploadProgress } from "@/types";

interface UploadStore {
  activeUploads: Map<string, UploadProgress>;
  setProgress: (uploadId: string, progress: UploadProgress) => void;
  removeUpload: (uploadId: string) => void;
  clearAll: () => void;
}

export const useUploadStore = create<UploadStore>((set) => ({
  activeUploads: new Map(),
  setProgress: (uploadId, progress) =>
    set((state) => {
      const newUploads = new Map(state.activeUploads);
      newUploads.set(uploadId, progress);
      return { activeUploads: newUploads };
    }),
  removeUpload: (uploadId) =>
    set((state) => {
      const newUploads = new Map(state.activeUploads);
      newUploads.delete(uploadId);
      return { activeUploads: newUploads };
    }),
  clearAll: () => set({ activeUploads: new Map() }),
}));
