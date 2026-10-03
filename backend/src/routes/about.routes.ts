import { Router } from "express";

import {
  getAboutController,
  getAdminAboutController,
  createAboutController,
  updateAboutController,
  deleteAboutController,
} from "../controllers/about.controller";

import {
  uploadAboutImagesController,
  deleteAboutImageController,
} from "../controllers/about-image.controller";

import { adminAuthMiddleware } from "../middleware/admin-auth.middleware";
import { uploadAboutImages } from "../middleware/upload.middleware";

const router = Router();

/* =========================================================
   PUBLIC
=========================================================*/

router.get("/about", getAboutController);

/* =========================================================
   ADMIN
=========================================================*/

router.get(
  "/admin/about",
  adminAuthMiddleware,
  getAdminAboutController
);

router.post(
  "/admin/about",
  adminAuthMiddleware,
  createAboutController
);

router.patch(
  "/admin/about",
  adminAuthMiddleware,
  updateAboutController
);

router.delete(
  "/admin/about",
  adminAuthMiddleware,
  deleteAboutController
);

/* =========================================================
   ABOUT IMAGES
=========================================================*/

router.post(
  "/admin/about/images",
  adminAuthMiddleware,
  uploadAboutImages.array("images", 30),
  uploadAboutImagesController
);

router.delete(
  "/admin/about/images",
  adminAuthMiddleware,
  deleteAboutImageController
);

export default router;