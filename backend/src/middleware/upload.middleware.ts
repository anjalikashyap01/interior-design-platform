import multer from "multer";

const storage = multer.memoryStorage();

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const fileFilter: multer.Options["fileFilter"] = (
  _req,
  file,
  cb
) => {
  if (!allowedMimeTypes.has(file.mimetype)) {
    cb(
      new Error(
        "Only JPG, PNG and WEBP images are allowed"
      )
    );
    return;
  }

  cb(null, true);
};

const IMAGE_FILE_SIZE = 10 * 1024 * 1024;

export const uploadDesignImages = multer({
  storage,
  fileFilter,
  limits: {
    files: 10,
    fileSize: IMAGE_FILE_SIZE,
  },
});

export const uploadServiceImage = multer({
  storage,
  fileFilter,
  limits: {
    files: 1,
    fileSize: IMAGE_FILE_SIZE,
  },
});

export const uploadAboutImages = multer({
  storage,
  fileFilter,
  limits: {
    files: 30,
    fileSize: IMAGE_FILE_SIZE,
  },
});