import type { Express } from "express";

import {
  deleteImage,
  uploadImageBuffer,
} from "./cloudinary.service";

export interface UploadedAboutImage {
  url: string;
  publicId: string;
}

/* =========================================================
   UPLOAD ABOUT IMAGE
=========================================================*/

export const uploadAboutImage = async (
  file: Express.Multer.File
): Promise<UploadedAboutImage> => {
  const result = await uploadImageBuffer(
    file.buffer,
    "interior-design-platform/about"
  );

  return {
    url: result.url,
    publicId: result.publicId,
  };
};

/* =========================================================
   DELETE ABOUT IMAGE
=========================================================*/

export const deleteAboutImage = async (
  publicId: string
): Promise<void> => {
  await deleteImage(publicId);
};