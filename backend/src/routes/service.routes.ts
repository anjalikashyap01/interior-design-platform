import { Router } from "express";

import {
  createServiceController,
  deleteServiceController,
  getAdminServiceController,
  getPublicServiceController,
  listAdminServicesController,
  listPublicServicesController,
  publishServiceController,
  unpublishServiceController,
  updateServiceController,
} from "../controllers/service.controller";

import {
  uploadServiceImage,
} from "../middleware/upload.middleware";

import { adminAuthMiddleware } from "../middleware/admin-auth.middleware";

const router = Router();

/*
|--------------------------------------------------------------------------
| PUBLIC SERVICE CATALOG
|--------------------------------------------------------------------------
*/

router.get(
  "/services",
  listPublicServicesController
);

router.get(
  "/services/:slug",
  getPublicServiceController
);

/*
|--------------------------------------------------------------------------
| ADMIN SERVICE CMS
|--------------------------------------------------------------------------
*/

router.post(
  "/admin/services",
  adminAuthMiddleware,
  uploadServiceImage.single("image"),
  createServiceController
);

router.get(
  "/admin/services",
  adminAuthMiddleware,
  listAdminServicesController
);

router.get(
  "/admin/services/:id",
  adminAuthMiddleware,
  getAdminServiceController
);

/*
|--------------------------------------------------------------------------
| UPDATE
|--------------------------------------------------------------------------
*/

router.patch(
  "/admin/services",
  adminAuthMiddleware,
  uploadServiceImage.single("image"),
  updateServiceController
);

/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
*/

router.delete(
  "/admin/services",
  adminAuthMiddleware,
  deleteServiceController
);

/*
|--------------------------------------------------------------------------
| PUBLISH
|--------------------------------------------------------------------------
*/

router.patch(
  "/admin/services/publish",
  adminAuthMiddleware,
  publishServiceController
);

/*
|--------------------------------------------------------------------------
| UNPUBLISH
|--------------------------------------------------------------------------
*/

router.patch(
  "/admin/services/unpublish",
  adminAuthMiddleware,
  unpublishServiceController
);

export default router;