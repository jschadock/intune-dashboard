import { create } from 'zustand';

interface UploadState {
  isUploading: boolean;
  progress: { step: string; current: number; total: number } | null;
  error: string | null;
  errorHint: string | null;
  fileName: string | null;

  setUploading: (val: boolean) => void;
  setProgress: (step: string, current: number, total: number) => void;
  setError: (msg: string | null, hint?: string | null) => void;
  setFileName: (name: string | null) => void;
  reset: () => void;
}

export const useUploadStore = create<UploadState>((set) => ({
  isUploading: false,
  progress: null,
  error: null,
  errorHint: null,
  fileName: null,

  setUploading: (val) => set({ isUploading: val }),
  setProgress: (step, current, total) => set({ progress: { step, current, total } }),
  setError: (msg, hint = null) => set({ error: msg, errorHint: hint }),
  setFileName: (name) => set({ fileName: name }),
  reset: () => set({ isUploading: false, progress: null, error: null, errorHint: null, fileName: null }),
}));
