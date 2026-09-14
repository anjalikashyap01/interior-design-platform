import { Router } from "express";

import {
  sendOtpController,
  verifyOtpController,
  getMeController,
  logoutController,
} from "../controllers/auth.controller";

import { validate } from "../middleware/validate.middleware";
import {
  sendOtpSchema,
  verifyOtpSchema,
} from "../schemas/auth.schema";

import { authMiddleware } from "../middleware/auth.middleware";
import { asyncHandler } from "../utils/async-handler";
import {
  authRateLimiter,
} from "../middleware/rate-limit.middleware";

const router = Router();

router.post(
  "/send-otp",
  authRateLimiter,
  validate(sendOtpSchema),
  asyncHandler(sendOtpController)
);

router.post(
  "/verify-otp",
  authRateLimiter,
  validate(verifyOtpSchema),
  asyncHandler(verifyOtpController)
);

router.get(
  "/me",
  authMiddleware,
  asyncHandler(getMeController)
);

router.post(
  "/logout",
  authMiddleware,
  asyncHandler(logoutController)
);

export default router;