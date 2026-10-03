import type { Request, Response } from "express";

import { asyncHandler } from "../utils/async-handler";
import { sendSuccess } from "../utils/api-response";
import { ApiError } from "../utils/api-error";

import { uploadAboutImage } from "../services/cloudinary/about-image.service";
import { deleteImage } from "../services/cloudinary/cloudinary.service";
import { deleteAboutImageByPublicId } from "../services/about.service";

/* =========================================================
   UPLOAD ABOUT IMAGES
=========================================================*/

export const uploadAboutImagesController = asyncHandler(
  async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[] | undefined;

    if (!files || files.length === 0) {
      throw new ApiError(400, "At least one image is required");
    }

    const uploaded: {
      url: string;
      publicId: string;
    }[] = [];

    try {
      for (const file of files) {
        uploaded.push(await uploadAboutImage(file));
      }
    } catch (error) {
      for (const image of uploaded) {
        try {
          await deleteImage(image.publicId);
        } catch (cleanupError) {
          console.error(
            "Failed to clean up uploaded About image:",
            cleanupError
          );
        }
      }

      throw error;
    }

    return sendSuccess(res, {
      statusCode: 201,
      message: "About images uploaded successfully",
      data: {
        images: uploaded,
      },
    });
  }
);

/* =========================================================
   DELETE ABOUT IMAGE
=========================================================*/

export const deleteAboutImageController = asyncHandler(
  async (req: Request, res: Response) => {
    const { publicId } = req.body;

    if (typeof publicId !== "string" || !publicId.trim()) {
      throw new ApiError(400, "publicId is required");
    }

    const about = await deleteAboutImageByPublicId(publicId);

    return sendSuccess(res, {
      message: "About image deleted successfully",
      data: about,
    });
  }
);