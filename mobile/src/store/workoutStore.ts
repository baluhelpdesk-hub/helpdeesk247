import { create } from "zustand";

interface SetLogEntry {
  id?: string;
  exerciseId: string;
  setNumber: number;
  weight: number | null;
  reps: number | null;
  rpe: number | null;
  isWarmup: boolean;
}

interface WorkoutState {
  activeSessionId: string | null;
  setLogs: Record<string, SetLogEntry[]>; // keyed by exerciseId
  restTimerActive: boolean;
  restTimerSeconds: number;
  postWorkoutLlmJobId: string | null;

  setActiveSession: (sessionId: string | null) => void;
  addSetLog: (exerciseId: string, log: SetLogEntry) => void;
  updateSetLog: (exerciseId: string, index: number, log: Partial<SetLogEntry>) => void;
  setRestTimer: (active: boolean, seconds?: number) => void;
  setPostWorkoutLlmJobId: (jobId: string | null) => void;
  reset: () => void;
}

const initialState = {
  activeSessionId: null,
  setLogs: {},
  restTimerActive: false,
  restTimerSeconds: 0,
  postWorkoutLlmJobId: null,
};

export const useWorkoutStore = create<WorkoutState>((set) => ({
  ...initialState,

  setActiveSession: (sessionId) => set({ activeSessionId: sessionId }),

  addSetLog: (exerciseId, log) =>
    set((state) => ({
      setLogs: {
        ...state.setLogs,
        [exerciseId]: [...(state.setLogs[exerciseId] ?? []), log],
      },
    })),

  updateSetLog: (exerciseId, index, log) =>
    set((state) => ({
      setLogs: {
        ...state.setLogs,
        [exerciseId]: state.setLogs[exerciseId]?.map((l, i) => (i === index ? { ...l, ...log } : l)) ?? [],
      },
    })),

  setRestTimer: (active, seconds) =>
    set((state) => ({
      restTimerActive: active,
      restTimerSeconds: seconds ?? state.restTimerSeconds,
    })),

  setPostWorkoutLlmJobId: (jobId) => set({ postWorkoutLlmJobId: jobId }),

  reset: () => set(initialState),
}));
