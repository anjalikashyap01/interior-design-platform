import { Router } from "express";

import authRoutes from "./auth.routes";
import adminAuthRoutes from "./admin-auth.routes";

const router = Router();

router.use("/auth", authRoutes);

router.use(
  "/admin/auth",
  adminAuthRoutes
);

export default router;