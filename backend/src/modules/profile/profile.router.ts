import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { validate } from "../../middleware/validate";
import { OnboardingSchema, UpdateProfileSchema, PushTokenSchema } from "./profile.schema";
import * as profileController from "./profile.controller";

export const profileRouter = Router();

profileRouter.post("/onboarding", authenticate, validate(OnboardingSchema), profileController.onboarding);
profileRouter.get("/", authenticate, profileController.getProfile);
profileRouter.patch("/", authenticate, validate(UpdateProfileSchema), profileController.updateProfile);
profileRouter.patch("/push-token", authenticate, validate(PushTokenSchema), profileController.savePushToken);
