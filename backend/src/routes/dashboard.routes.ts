import { Router } from "express";

import { getAdminDashboardController } from "../controllers/dashboard.controller";
import { adminAuthMiddleware } from "../middleware/admin-auth.middleware";

const router = Router();

router.get(
  "/admin/dashboard",
  adminAuthMiddleware,
  getAdminDashboardController
);

export default router;