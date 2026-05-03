import { Router } from "express";
import { validate } from "../../middleware/validate";
import { RegisterSchema, LoginSchema, RefreshSchema, ForgotPasswordSchema } from "./auth.schema";
import * as authController from "./auth.controller";

export const authRouter = Router();

authRouter.post("/register", validate(RegisterSchema), authController.register);
authRouter.post("/login", validate(LoginSchema), authController.login);
authRouter.post("/refresh", validate(RefreshSchema), authController.refresh);
authRouter.post("/logout", authController.logout);
authRouter.post("/forgot-password", validate(ForgotPasswordSchema), authController.forgotPassword);
