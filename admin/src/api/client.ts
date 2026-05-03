import axios from "axios";

const SECRET = localStorage.getItem("adminSecret") ?? "";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
  headers: { "x-admin-secret": SECRET },
});

export function setAdminSecret(secret: string) {
  localStorage.setItem("adminSecret", secret);
  client.defaults.headers["x-admin-secret"] = secret;
}

export function getAdminSecret(): string {
  return localStorage.getItem("adminSecret") ?? "";
}

// Dashboard
export const dashboardApi = {
  get: () => client.get("/admin/dashboard").then((r) => r.data),
};

// Exercises
export interface Exercise {
  id: string;
  name: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  equipment: string[];
  difficulty: string;
  videoUrl: string | null;
  instructions: string[];
  commonMistakes: string[];
}

export const exercisesApi = {
  list: () => client.get<Exercise[]>("/admin/exercises").then((r) => r.data),
  get: (id: string) => client.get<Exercise>(`/admin/exercises/${id}`).then((r) => r.data),
  create: (data: Partial<Exercise>) => client.post<Exercise>("/admin/exercises", data).then((r) => r.data),
  update: (id: string, data: Partial<Exercise>) => client.put<Exercise>(`/admin/exercises/${id}`, data).then((r) => r.data),
  delete: (id: string) => client.delete(`/admin/exercises/${id}`),
};

// Program Templates
export interface ProgramTemplate {
  id: string;
  name: string;
  description: string | null;
  goal: string;
  experience: string[];
  location: string;
  daysPerWeek: number;
  progressionModel: string;
  workoutTemplates?: WorkoutTemplate[];
}

export interface WorkoutTemplate {
  id: string;
  label: string;
  order: number;
  exercises: WorkoutExerciseSlot[];
}

export interface WorkoutExerciseSlot {
  id: string;
  sets: number;
  repsMin: number;
  repsMax: number;
  restSeconds: number;
  exercise: { id: string; name: string };
}

export const templatesApi = {
  list: () => client.get<ProgramTemplate[]>("/admin/program-templates").then((r) => r.data),
  get: (id: string) => client.get<ProgramTemplate>(`/admin/program-templates/${id}`).then((r) => r.data),
  create: (data: Partial<ProgramTemplate>) => client.post<ProgramTemplate>("/admin/program-templates", data).then((r) => r.data),
  update: (id: string, data: Partial<ProgramTemplate>) => client.put<ProgramTemplate>(`/admin/program-templates/${id}`, data).then((r) => r.data),
  delete: (id: string) => client.delete(`/admin/program-templates/${id}`),
};
