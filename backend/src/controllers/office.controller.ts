import { Request, Response } from "express";

import Office from "../models/Office";
import {
  createOfficeSchema,
  updateOfficeSchema,
} from "../schemas/office.schema";
import { asyncHandler } from "../utils/async-handler";
import { sendSuccess } from "../utils/api-response";
import { ApiError } from "../utils/api-error";

const getOffice = async () => {
  return Office.findOne().sort({ createdAt: 1 });
};

/* =========================================================
   PUBLIC: GET OFFICE
========================================================= */

export const getOfficeController = asyncHandler(
  async (_req: Request, res: Response) => {
    const office = await getOffice();

    if (!office) {
      throw new ApiError(404, "Office information not found");
    }

    return sendSuccess(res, {
      message: "Office information fetched successfully",
      data: office,
    });
  }
);

/* =========================================================
   ADMIN: GET OFFICE
========================================================= */

export const getAdminOfficeController = asyncHandler(
  async (_req: Request, res: Response) => {
    const office = await getOffice();

    if (!office) {
      throw new ApiError(404, "Office information not found");
    }

    return sendSuccess(res, {
      message: "Office information fetched successfully",
      data: office,
    });
  }
);

/* =========================================================
   ADMIN: CREATE OFFICE
========================================================= */

export const createOfficeController = asyncHandler(
  async (req: Request, res: Response) => {
    const parsed = createOfficeSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new ApiError(
        400,
        "Validation failed",
        parsed.error.flatten()
      );
    }

    const existingOffice = await Office.findOne();

    if (existingOffice) {
      throw new ApiError(
        409,
        "Office information already exists. Update the existing office instead."
      );
    }

    const office = await Office.create(parsed.data);

    return sendSuccess(res, {
      statusCode: 201,
      message: "Office information created successfully",
      data: office,
    });
  }
);

/* =========================================================
   ADMIN: UPDATE OFFICE
========================================================= */

export const updateOfficeController = asyncHandler(
  async (req: Request, res: Response) => {
    const parsed = updateOfficeSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new ApiError(
        400,
        "Validation failed",
        parsed.error.flatten()
      );
    }

    const office = await getOffice();

    if (!office) {
      throw new ApiError(
        404,
        "Office information not found"
      );
    }

    Object.assign(office, parsed.data);

    await office.save();

    return sendSuccess(res, {
      message: "Office information updated successfully",
      data: office,
    });
  }
);

/* =========================================================
   ADMIN: DELETE OFFICE
========================================================= */

export const deleteOfficeController = asyncHandler(
  async (_req: Request, res: Response) => {
    const office = await getOffice();

    if (!office) {
      throw new ApiError(
        404,
        "Office information not found"
      );
    }

    await office.deleteOne();

    return sendSuccess(res, {
      message: "Office information deleted successfully",
      data: office,
    });
  }
);