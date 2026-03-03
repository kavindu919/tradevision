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

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshTokens);
router.post("/logout", logout);
router.post("/verify-email", verifyEmail);
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
