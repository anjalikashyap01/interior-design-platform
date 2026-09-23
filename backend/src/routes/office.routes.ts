import { Router } from "express";

import {
  getOfficeController,
  getAdminOfficeController,
  createOfficeController,
  updateOfficeController,
  deleteOfficeController,
} from "../controllers/office.controller";

import { adminAuthMiddleware } from "../middleware/admin-auth.middleware";

const router = Router();

/* =========================================================
   PUBLIC OFFICE
========================================================= */

router.get(
  "/office",
  getOfficeController
);

/* =========================================================
   ADMIN OFFICE
========================================================= */

router.get(
  "/admin/office",
  adminAuthMiddleware,
  getAdminOfficeController
);

router.post(
  "/admin/office",
  adminAuthMiddleware,
  createOfficeController
);

router.patch(
  "/admin/office",
  adminAuthMiddleware,
  updateOfficeController
);

router.delete(
  "/admin/office",
  adminAuthMiddleware,
  deleteOfficeController
);

export default router;