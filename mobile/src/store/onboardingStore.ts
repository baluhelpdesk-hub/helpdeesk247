import { create } from "zustand";

interface OnboardingData {
  ageRange?: string;
  sex?: string;
  trainingExp?: string;
  goal?: string;
  location?: string;
  equipment?: string[];
  daysPerWeek?: number;
  minutesPerSession?: number;
}

interface OnboardingStore {
  data: OnboardingData;
  setField: <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  data: {},
  setField: (key, value) => set((state) => ({ data: { ...state.data, [key]: value } })),
  reset: () => set({ data: {} }),
}));
