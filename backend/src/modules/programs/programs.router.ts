import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import * as programsController from "./programs.controller";

export const programsRouter = Router();

programsRouter.get("/active", authenticate, programsController.getActive);
programsRouter.get("/templates", authenticate, programsController.listTemplates);
programsRouter.post("/switch", authenticate, programsController.switchProgram);
