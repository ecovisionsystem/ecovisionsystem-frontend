import { create } from "zustand";
import type { InferenceJob } from "@/types";

interface JobStore {
  selectedJobId: string | null;
  jobFilters: {
    status?: string;
    userId?: string;
  };
  setSelectedJob: (jobId: string | null) => void;
  setFilters: (filters: JobStore["jobFilters"]) => void;
}

export const useJobStore = create<JobStore>((set) => ({
  selectedJobId: null,
  jobFilters: {},
  setSelectedJob: (jobId) => set({ selectedJobId: jobId }),
  setFilters: (filters) => set({ jobFilters: filters }),
}));
