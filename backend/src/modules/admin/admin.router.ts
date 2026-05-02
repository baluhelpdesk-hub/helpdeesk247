import { Router, Request, Response, NextFunction } from "express";
import { prisma } from "../../config/prisma";
import { env } from "../../config/env";

export const adminRouter = Router();

function adminAuth(req: Request, res: Response, next: NextFunction): void {
  if (req.headers["x-admin-secret"] !== env.ADMIN_SECRET) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

adminRouter.use(adminAuth);

// Dashboard counts
adminRouter.get("/dashboard", async (_req, res) => {
  const [userCount, exerciseCount, templateCount, sessionCount] = await Promise.all([
    prisma.user.count(),
    prisma.exercise.count(),
    prisma.programTemplate.count(),
    prisma.workoutSession.count(),
  ]);
  res.json({ userCount, exerciseCount, templateCount, sessionCount });
});

// Exercises CRUD
adminRouter.get("/exercises", async (_req, res) => {
  const exercises = await prisma.exercise.findMany({ orderBy: { name: "asc" } });
  res.json(exercises);
});

adminRouter.get("/exercises/:id", async (req, res) => {
  const exercise = await prisma.exercise.findUnique({ where: { id: req.params.id } });
  if (!exercise) { res.status(404).json({ error: "Not found" }); return; }
  res.json(exercise);
});

adminRouter.post("/exercises", async (req, res) => {
  const { name, primaryMuscles, secondaryMuscles, equipment, difficulty, videoUrl, instructions, commonMistakes } = req.body;
  const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const exercise = await prisma.exercise.create({
    data: { name, slug, primaryMuscles, secondaryMuscles, equipment, difficulty, videoUrl, instructions, commonMistakes },
  });
  res.status(201).json(exercise);
});

adminRouter.put("/exercises/:id", async (req, res) => {
  const { name, primaryMuscles, secondaryMuscles, equipment, difficulty, videoUrl, instructions, commonMistakes } = req.body;
  const exercise = await prisma.exercise.update({
    where: { id: req.params.id },
    data: { name, primaryMuscles, secondaryMuscles, equipment, difficulty, videoUrl, instructions, commonMistakes },
  });
  res.json(exercise);
});

adminRouter.delete("/exercises/:id", async (req, res) => {
  await prisma.exercise.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

// Program Templates CRUD
adminRouter.get("/program-templates", async (_req, res) => {
  const templates = await prisma.programTemplate.findMany({
    include: { workoutTemplates: { include: { exercises: { include: { exercise: true } } } } },
    orderBy: { name: "asc" },
  });
  res.json(templates);
});

adminRouter.get("/program-templates/:id", async (req, res) => {
  const template = await prisma.programTemplate.findUnique({
    where: { id: req.params.id },
    include: { workoutTemplates: { include: { exercises: { include: { exercise: true } } } } },
  });
  if (!template) { res.status(404).json({ error: "Not found" }); return; }
  res.json(template);
});

adminRouter.post("/program-templates", async (req, res) => {
  const { name, goal, experience, location, daysPerWeek, progressionModel, description } = req.body;
  const template = await prisma.programTemplate.create({
    data: { name, goal, experience, location, daysPerWeek, progressionModel, description },
  });
  res.status(201).json(template);
});

adminRouter.put("/program-templates/:id", async (req, res) => {
  const { name, goal, experience, location, daysPerWeek, progressionModel, description } = req.body;
  const template = await prisma.programTemplate.update({
    where: { id: req.params.id },
    data: { name, goal, experience, location, daysPerWeek, progressionModel, description },
  });
  res.json(template);
});

adminRouter.delete("/program-templates/:id", async (req, res) => {
  await prisma.programTemplate.delete({ where: { id: req.params.id } });
  res.status(204).send();
});
