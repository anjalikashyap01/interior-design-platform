import { Request, Response } from "express";

import {
  createAboutSchema,
  updateAboutSchema,
} from "../schemas/about.schema";

import { asyncHandler } from "../utils/async-handler";
import { sendSuccess } from "../utils/api-response";
import { ApiError } from "../utils/api-error";

import {
  getAbout,
  createAbout,
  updateAbout,
  deleteAbout,
} from "../services/about.service";

/* =========================================================
   PUBLIC
=========================================================*/

export const getAboutController = asyncHandler(
  async (_req: Request, res: Response) => {
    const about = await getAbout();

    if (!about) {
      throw new ApiError(404, "About content not found");
    }

    return sendSuccess(res, {
      message: "About content fetched successfully",
      data: about,
    });
  }
);

/* =========================================================
   ADMIN GET
=========================================================*/

export const getAdminAboutController = asyncHandler(
  async (_req: Request, res: Response) => {
    const about = await getAbout();

    if (!about) {
      throw new ApiError(404, "About content not found");
    }

    return sendSuccess(res, {
      message: "About content fetched successfully",
      data: about,
    });
  }
);

/* =========================================================
   CREATE
=========================================================*/

export const createAboutController = asyncHandler(
  async (req: Request, res: Response) => {
    const parsed = createAboutSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new ApiError(
        400,
        parsed.error.issues.map((issue) => issue.message).join(", ")
      );
    }

    const existing = await getAbout();

    if (existing) {
      throw new ApiError(409, "About content already exists");
    }

    const about = await createAbout(parsed.data);

    return sendSuccess(res, {
      statusCode: 201,
      message: "About content created successfully",
      data: about,
    });
  }
);

/* =========================================================
   UPDATE
=========================================================*/

export const updateAboutController = asyncHandler(
  async (req: Request, res: Response) => {
    const parsed = updateAboutSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new ApiError(
        400,
        parsed.error.issues.map((issue) => issue.message).join(", ")
      );
    }

    const existing = await getAbout();

    if (!existing) {
      throw new ApiError(404, "About content not found");
    }

    const about = await updateAbout(parsed.data);

    return sendSuccess(res, {
      message: "About content updated successfully",
      data: about,
    });
  }
);

/* =========================================================
   DELETE
=========================================================*/

export const deleteAboutController = asyncHandler(
  async (_req: Request, res: Response) => {
    const deleted = await deleteAbout();

    if (!deleted) {
      throw new ApiError(404, "About content not found");
    }

    return sendSuccess(res, {
      message: "About content deleted successfully",
      data: deleted,
    });
  }
);