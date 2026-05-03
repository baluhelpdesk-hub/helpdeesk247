import { z } from "zod";

export const OnboardingSchema = z.object({
  ageRange: z.enum(["18-24", "25-34", "35-44", "45-54", "55+"]),
  sex: z.enum(["male", "female", "prefer_not_to_say"]),
  trainingExp: z.enum(["new", "some", "regular"]),
  goal: z.enum(["lose_fat", "build_muscle", "get_stronger", "general_fitness"]),
  location: z.enum(["gym", "home", "both"]),
  equipment: z.array(z.string()).min(1),
  daysPerWeek: z.number().int().min(2).max(5),
  minutesPerSession: z.number().int().refine((v) => [30, 45, 60].includes(v), "Must be 30, 45, or 60"),
});

export const UpdateProfileSchema = OnboardingSchema.partial().extend({
  units: z.enum(["kg", "lb"]).optional(),
});

export const PushTokenSchema = z.object({
  expoPushToken: z.string(),
});

export type OnboardingInput = z.infer<typeof OnboardingSchema>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
