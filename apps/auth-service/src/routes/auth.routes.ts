import { Router } from "express";
import passport from "../middleware/passport.middleware";

import {
  getMe,
  googleCallbackController,
  login,
  logout,
  refreshTokens,
  register,
  verifyEmail,
} from "../controllers/auth.controller";
import { validate } from "../middleware/validate.middleware";
import {
  loginSchema,
  refreshSchema,
  registerSchema,
  verifyEmailSchema,
} from "../schemas/auth.schema";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh", validate(refreshSchema), refreshTokens);
router.post("/logout", logout);
router.post("/verify-email", validate(verifyEmailSchema), verifyEmail);
router.get("/me", getMe);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/auth/error",
  }),
  googleCallbackController,
);

export default router;
