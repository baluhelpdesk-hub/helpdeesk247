import { Router, Request, Response } from "express";
import { authenticate } from "../../middleware/authenticate";
import { getLlmJob, enqueueLlmJob } from "./llm.service";
import { prisma } from "../../config/prisma";

export const llmRouter = Router();

// Poll job status
llmRouter.get("/:jobId", authenticate, async (req, res, next) => {
  try {
    const job = await getLlmJob(req.userId, req.params.jobId);
    res.json({
      id: job.id,
      status: job.status,
      jobType: job.jobType,
      outputText: job.outputText,
      errorMessage: job.errorMessage,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    });
  } catch (err) {
    next(err);
  }
});

// SSE stream for real-time job updates
llmRouter.get("/:jobId/stream", authenticate, async (req: Request, res: Response) => {
  const { jobId } = req.params;
  const userId = req.userId;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const sendEvent = (data: Record<string, unknown>) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  const poll = setInterval(async () => {
    try {
      const job = await prisma.llmJob.findUnique({ where: { id: jobId } });
      if (!job || job.userId !== userId) {
        sendEvent({ error: "Not found" });
        clearInterval(poll);
        res.end();
        return;
      }

      sendEvent({ status: job.status, outputText: job.outputText });

      if (job.status === "done" || job.status === "failed") {
        clearInterval(poll);
        res.end();
      }
    } catch {
      clearInterval(poll);
      res.end();
    }
  }, 1500);

  req.on("close", () => {
    clearInterval(poll);
  });
});

// User Q&A: enqueue a question for Llama
llmRouter.post("/user-qa", authenticate, async (req, res, next) => {
  try {
    const { question } = req.body;
    if (!question) {
      res.status(400).json({ error: "question is required" });
      return;
    }

    const profile = await prisma.profile.findUnique({ where: { userId: req.userId } });

    const jobId = await enqueueLlmJob({
      userId: req.userId,
      jobType: "user_qa",
      inputData: {
        userId: req.userId,
        question,
        userGoal: profile?.goal ?? "general_fitness",
        trainingExp: profile?.trainingExp ?? "new",
      },
    });

    res.status(202).json({ jobId });
  } catch (err) {
    next(err);
  }
});
