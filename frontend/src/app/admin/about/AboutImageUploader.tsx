"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { adminAboutApi, type AboutImage } from "@/lib/api";

interface AboutImageUploaderProps {
  label: string;
  images?: AboutImage[];
  multiple?: boolean;
  maxImages?: number;
  onImagesChange: (images: AboutImage[]) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export default function AboutImageUploader({
  label,
  images: incomingImages,
  multiple = false,
  maxImages = 1,
  onImagesChange,
}: AboutImageUploaderProps) {
  // Keep one safe array for all rendering and update operations.
  const images: AboutImage[] = Array.isArray(incomingImages)
    ? incomingImages
    : [];

  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const generatedId = useId();
  const inputId = `about-image-upload-${generatedId}`;

  const handleSelectFiles = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = event.currentTarget;
    const files = Array.from(input.files ?? []);

    if (files.length === 0) return;
    setError("");

    const invalidFile = files.find((file) => !ACCEPTED_TYPES.has(file.type));
    if (invalidFile) {
      setError(
        `"${invalidFile.name}" is not supported. Please use JPG, PNG or WEBP.`
      );
      input.value = "";
      return;
    }

    const oversizedFile = files.find((file) => file.size > MAX_FILE_SIZE);
    if (oversizedFile) {
      setError(`"${oversizedFile.name}" is larger than 10MB.`);
      input.value = "";
      return;
    }

    const availableSlots = multiple ? maxImages - images.length : 1;
    if (multiple && availableSlots <= 0) {
      setError(`Maximum of ${maxImages} images allowed.`);
      input.value = "";
      return;
    }

    const filesToUpload = multiple
      ? files.slice(0, availableSlots)
      : files.slice(0, 1);

    try {
      setUploading(true);
      const response = await adminAboutApi.uploadImages(filesToUpload);
      const uploaded: AboutImage[] = Array.isArray(response) ? response : [];

      if (uploaded.length === 0 || !uploaded[0]) {
        throw new Error("Image upload completed but no image was returned.");
      }

      if (multiple) {
        onImagesChange([...images, ...uploaded]);
      } else {
        onImagesChange([uploaded[0]]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image.");
    } finally {
      setUploading(false);
      input.value = "";
    }
  };

  const handleDelete = async (image: AboutImage) => {
    try {
      setDeletingId(image.publicId);
      setError("");
      await adminAboutApi.deleteImage(image.publicId);
      onImagesChange(images.filter((item) => item.publicId !== image.publicId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete image.");
    } finally {
      setDeletingId(null);
    }
  };

  const canUpload = multiple ? images.length < maxImages : true;

  return (
    <div>
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

      {images.length > 0 && (
        <div className="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image) => {
            const isDeleting = deletingId === image.publicId;

            return (
              <div
                key={image.publicId}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white"
              >
                <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
                  <Image
                    src={image.url}
                    alt={image.alt || `${label} image`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    unoptimized
                    className="object-cover"
                  />

                  {uploading && !multiple && (
                    <div
                      role="status"
                      aria-live="polite"
                      className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/45 text-white"
                    >
                      <svg
                        className="h-8 w-8 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="9"
                          stroke="currentColor"
                          strokeWidth="3"
                          className="opacity-30"
                        />
                        <path
                          d="M21 12a9 9 0 0 0-9-9"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="text-sm font-medium">
                        Uploading new image...
                      </span>
                      <span className="text-xs">
                        Your existing image is preserved
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between gap-3 p-3">
                  <p
                    className="min-w-0 flex-1 truncate text-xs text-gray-500"
                    title={image.publicId}
                  >
                    {image.publicId}
                  </p>
                  <button
                    type="button"
                    onClick={() => void handleDelete(image)}
                    disabled={isDeleting || uploading}
                    className="shrink-0 rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {canUpload && (
        <div
          className={`rounded-xl border border-dashed border-gray-300 bg-gray-50 px-5 py-8 text-center transition ${
            uploading
              ? "cursor-wait"
              : "hover:border-gray-400 hover:bg-gray-100"
          }`}
        >
          <label
            htmlFor={inputId}
            className={
              uploading
                ? "pointer-events-none flex flex-col items-center"
                : "flex cursor-pointer flex-col items-center"
            }
          >
            {uploading ? (
              <>
                <svg
                  className="mb-3 h-8 w-8 animate-spin text-gray-700"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="opacity-20"
                  />
                  <path
                    d="M21 12a9 9 0 0 0-9-9"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
                <span
                  role="status"
                  aria-live="polite"
                  className="text-sm font-semibold text-gray-800"
                >
                  Uploading your image...
                </span>
                <span className="mt-2 text-xs text-gray-500">
                  Please wait while your image is being saved.
                </span>
              </>
            ) : (
              <>
                <span className="text-sm font-semibold text-gray-800">
                  {images.length > 0 ? "Replace Image" : "Upload Image"}
                </span>
                <span className="mt-1 block text-xs text-gray-500">
                  JPG, PNG or WEBP · Max 10MB
                </span>
              </>
            )}

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
        </div>
      )}

      {multiple && !canUpload && (
        <p className="mt-2 text-xs text-gray-500">
          Maximum number of images reached.
        </p>
      )}

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
