"use client";

import { useId, useState } from "react";

import {
  adminAboutApi,
  type AboutImage,
} from "@/lib/api";

interface AboutImageUploaderProps {
  label: string;
  images: AboutImage[];
  multiple?: boolean;
  maxImages?: number;
  onImagesChange: (images: AboutImage[]) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ACCEPTED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export default function AboutImageUploader({
  label,
  images,
  multiple = false,
  maxImages = 1,
  onImagesChange,
}: AboutImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(
    null
  );
  const [error, setError] = useState("");

  const generatedId = useId();

  const inputId = `about-image-upload-${generatedId}`;

  const handleSelectFiles = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) {
      return;
    }

    setError("");

    /* =========================================================
       FILE TYPE VALIDATION
    ========================================================= */

    const invalidFile = files.find(
      (file) => !ACCEPTED_TYPES.has(file.type)
    );

    if (invalidFile) {
      setError(
        `"${invalidFile.name}" is not a supported image. Please use JPG, PNG or WEBP.`
      );

      event.target.value = "";
      return;
    }

    /* =========================================================
       FILE SIZE VALIDATION
    ========================================================= */

    const oversizedFile = files.find(
      (file) => file.size > MAX_FILE_SIZE
    );

    if (oversizedFile) {
      setError(
        `"${oversizedFile.name}" is larger than 10MB. Please choose a smaller image.`
      );

      event.target.value = "";
      return;
    }

    /* =========================================================
       AVAILABLE SLOTS
    ========================================================= */

    const availableSlots = multiple
      ? maxImages - images.length
      : 1;

    if (multiple && availableSlots <= 0) {
      setError(
        `Maximum of ${maxImages} images allowed.`
      );

      event.target.value = "";
      return;
    }

    const filesToUpload = multiple
      ? files.slice(0, availableSlots)
      : files.slice(0, 1);

    try {
      setUploading(true);

      /*
       * For single-image fields, upload the new image first.
       * After successful upload, delete the old image.
       *
       * This prevents losing the old image if the new upload fails.
       */

      const uploaded =
        await adminAboutApi.uploadImages(
          filesToUpload
        );

      if (multiple) {
        onImagesChange([
          ...images,
          ...uploaded,
        ]);
      } else {
        const newImage = uploaded[0];

        if (!newImage) {
          throw new Error(
            "Image upload completed but no image was returned."
          );
        }

        const oldImage = images[0];

        onImagesChange([newImage]);

        /*
         * Delete the previous image after the new image
         * has been successfully uploaded and attached
         * to the frontend state.
         */
        if (oldImage) {
          try {
            await adminAboutApi.deleteImage(
              oldImage.publicId
            );
          } catch (deleteError) {
            console.error(
              "Failed to delete previous image:",
              deleteError
            );
          }
        }
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to upload image."
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleDelete = async (
    image: AboutImage
  ) => {
    try {
      setDeletingId(image.publicId);
      setError("");

      await adminAboutApi.deleteImage(
        image.publicId
      );

      onImagesChange(
        images.filter(
          (item) =>
            item.publicId !== image.publicId
        )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete image."
      );
    } finally {
      setDeletingId(null);
    }
  };

  /*
   * Multiple uploader:
   * Upload is available until maxImages is reached.
   *
   * Single uploader:
   * Upload is always available so the existing image
   * can be replaced.
   */
  const canUpload = multiple
    ? images.length < maxImages
    : true;

  return (
    <div>
      {/* =======================================================
          LABEL
      ======================================================= */}

      <div className="mb-3 flex items-center justify-between gap-3">
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>

        <span className="text-xs text-gray-500">
          {images.length}/{maxImages}
        </span>
      </div>

      {/* =======================================================
          IMAGE PREVIEWS
      ======================================================= */}

      {images.length > 0 && (
        <div className="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image) => {
            const isDeleting =
              deletingId === image.publicId;

            return (
              <div
                key={image.publicId}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white"
              >
                {/* IMAGE */}

                <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
                  {/*
                   * Use Cloudinary URL directly.
                   *
                   * We intentionally don't use next/image here
                   * because the Next.js image optimizer was
                   * timing out while fetching Cloudinary images.
                   */}

                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.url}
                    alt={
                      image.alt ||
                      `${label} image`
                    }
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* IMAGE ACTIONS */}

                <div className="flex items-center justify-between gap-3 p-3">
                  <p
                    className="min-w-0 flex-1 truncate text-xs text-gray-500"
                    title={image.publicId}
                  >
                    {image.publicId}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      void handleDelete(image)
                    }
                    disabled={
                      isDeleting || uploading
                    }
                    className="shrink-0 rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isDeleting
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =======================================================
          UPLOAD AREA
      ======================================================= */}

      {canUpload && (
        <label
          htmlFor={inputId}
          className={`block w-full rounded-xl border border-dashed border-gray-300 bg-gray-50 px-5 py-8 text-center transition ${
            uploading
              ? "cursor-not-allowed opacity-60"
              : "cursor-pointer hover:border-gray-400 hover:bg-gray-100"
          }`}
        >
          <span className="block text-sm font-semibold text-gray-800">
            {uploading
              ? "Uploading..."
              : images.length > 0
              ? "Replace Image"
              : "Upload Image"}
          </span>

          <span className="mt-1 block text-xs text-gray-500">
            JPG, PNG or WEBP · Max 10MB
          </span>

          <input
            id={inputId}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple={multiple}
            onChange={handleSelectFiles}
            disabled={uploading}
            className="sr-only"
          />
        </label>
      )}

      {/* =======================================================
          MAXIMUM LIMIT
      ======================================================= */}

      {multiple && !canUpload && (
        <p className="mt-2 text-xs text-gray-500">
          Maximum number of images reached.
        </p>
      )}

      {/* =======================================================
          ERROR
      ======================================================= */}

      {error && (
        <div
          role="alert"
          className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600"
        >
          {error}
        </div>
      )}
    </div>
  );
}