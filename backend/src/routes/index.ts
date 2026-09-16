import { Router } from "express";

import adminAuthRoutes from "./admin-auth.routes";
import clerkAuthRoutes from "./clerk-auth.routes";
import clerkTestRoutes from "./clerk-test.routes";
import designRoutes from "./design.routes";

const router = Router();

router.use("/admin/auth", adminAuthRoutes);

router.use("/clerk-auth", clerkAuthRoutes);

router.use("/clerk-test", clerkTestRoutes);

router.use("/", designRoutes);

export default router;