"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { adminTestimonialApi, Testimonial } from "@/lib/api";
import Image from "next/image";
export default function EditTestimonialPage() {
  const params = useParams();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const id = Array.isArray(params.id)
    ? params.id[0]
    : (params.id as string);

  const [testimonial, setTestimonial] =
    useState<Testimonial | null>(null);

  const [customerName, setCustomerName] = useState("");
  const [role, setRole] = useState("");
  const [rating, setRating] = useState("5");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
 const [status, setStatus] = useState<"draft" | "published">("draft");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const loadTestimonial = async () => {
      try {
        setLoading(true);
        setError("");

        const result =
          await adminTestimonialApi.getTestimonial(id);

       setTestimonial(result);

setCustomerName(result.customerName ?? "");
setRole(result.role ?? "");
setRating(String(result.rating ?? 5));
setContent(result.content ?? "");
setStatus(result.status ?? "draft");
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load testimonial"
        );
      } finally {
        setLoading(false);
      }
    };

    loadTestimonial();
  }, [id]);

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0] ?? null;

    if (!selectedFile) {
      setImage(null);
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Please select a JPG, PNG, or WebP image.");
      event.target.value = "";
      setImage(null);
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("Image size must not exceed 5 MB.");
      event.target.value = "";
      setImage(null);
      return;
    }

    setError("");
    setImage(selectedFile);
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const parsedRating = Number(rating);

    if (!customerName.trim()) {
      setError("Customer name is required.");
      return;
    }

    if (customerName.trim().length < 2) {
      setError(
        "Customer name must be at least 2 characters."
      );
      return;
    }

    if (!content.trim()) {
      setError("Content is required.");
      return;
    }

    if (content.trim().length < 5) {
      setError("Content must be at least 5 characters.");
      return;
    }

    if (
      !Number.isInteger(parsedRating) ||
      parsedRating < 1 ||
      parsedRating > 5
    ) {
      setError("Rating must be between 1 and 5.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const formData = new FormData();

      formData.append(
        "customerName",
        customerName.trim()
      );

      formData.append("role", role.trim());

      formData.append(
        "rating",
        String(parsedRating)
      );

      formData.append(
        "content",
        content.trim()
      );

      formData.append("status", status);

      if (image) {
        formData.append("image", image);
      }

      await adminTestimonialApi.updateTestimonial(
        id,
        formData
      );

      router.push("/admin/testimonials");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update testimonial"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <p className="text-sm text-gray-500">
          Loading testimonial...
        </p>
      </main>
    );
  }

  if (!testimonial) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error || "Testimonial not found."}
        </div>

        <Link
          href="/admin/testimonials"
          className="mt-4 inline-block text-sm underline"
        >
          Back to Testimonials
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <div className="mb-6">
        <Link
          href="/admin/testimonials"
          className="text-sm text-gray-500 hover:text-black"
        >
          &larr; Back to Testimonials
        </Link>

        <h1 className="mt-3 text-2xl font-bold">
          Edit Testimonial
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Update this customer testimonial.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-5 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-lg border bg-white p-6"
      >
        {/* Customer Name */}
        <div>
          <label
            htmlFor="customerName"
            className="mb-1 block text-sm font-medium"
          >
            Customer Name *
          </label>

          <input
            id="customerName"
            type="text"
            required
            minLength={2}
            maxLength={100}
            value={customerName}
            onChange={(event) =>
              setCustomerName(event.target.value)
            }
            placeholder="Enter customer name"
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-black"
          />
        </div>

        {/* Role */}
        <div>
          <label
            htmlFor="role"
            className="mb-1 block text-sm font-medium"
          >
            Role or Designation
          </label>

          <input
            id="role"
            type="text"
            maxLength={100}
            value={role}
            onChange={(event) =>
              setRole(event.target.value)
            }
            placeholder="e.g. Homeowner, Delhi"
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-black"
          />
        </div>

        {/* Rating */}
        <div>
          <label
            htmlFor="rating"
            className="mb-1 block text-sm font-medium"
          >
            Rating *
          </label>

          <select
            id="rating"
            required
            value={rating}
            onChange={(event) =>
              setRating(event.target.value)
            }
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-black"
          >
            <option value="5">5 stars</option>
            <option value="4">4 stars</option>
            <option value="3">3 stars</option>
            <option value="2">2 stars</option>
            <option value="1">1 star</option>
          </select>
        </div>

        {/* Content */}
        <div>
          <label
            htmlFor="content"
            className="mb-1 block text-sm font-medium"
          >
            Testimonial Message *
          </label>

          <textarea
            id="content"
            required
            minLength={5}
            maxLength={1000}
            rows={6}
            value={content}
            onChange={(event) =>
              setContent(event.target.value)
            }
            placeholder="Enter the customer's feedback"
            className="w-full resize-y rounded-md border px-3 py-2 text-sm outline-none focus:border-black"
          />

          <p className="mt-1 text-right text-xs text-gray-500">
            {content.length}/1000 characters
          </p>
        </div>

        {/* Existing Image */}
        {testimonial.imageUrl && !image && (
          <div>
            <p className="mb-2 text-sm font-medium">
              Current Image
            </p>

            <Image
  src={testimonial.imageUrl}
  alt={testimonial.customerName}
  width={96}
  height={96}
  className="h-24 w-24 rounded-md object-cover"
/>
          </div>
        )}

        {/* New Image */}
        <div>
          <label
            htmlFor="image"
            className="mb-1 block text-sm font-medium"
          >
            Replace Customer Image
          </label>

          <input
            ref={fileInputRef}
            id="image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            className="w-full rounded-md border px-3 py-2 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-sm file:font-medium"
          />

          <p className="mt-1 text-xs text-gray-500">
            Optional. JPG, PNG, or WebP. Maximum size: 5 MB.
          </p>

          {image && (
            <div className="mt-2 flex items-center justify-between rounded-md bg-gray-50 p-3 text-sm">
              <span className="truncate">
                New image: {image.name}
              </span>

              <button
                type="button"
                onClick={() => {
                  setImage(null);

                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
                className="ml-3 shrink-0 text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {/* Status */}
<div className="rounded-md border p-4">
  <label
    htmlFor="status"
    className="mb-1 block text-sm font-medium"
  >
    Status
  </label>

  <select
    id="status"
    value={status}
    onChange={(event) =>
      setStatus(event.target.value as "draft" | "published")
    }
    className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-black"
  >
    <option value="draft">Draft</option>
    <option value="published">Published</option>
  </select>

  <p className="mt-1 text-xs text-gray-500">
    Choose whether this testimonial is visible publicly.
  </p>
</div>

        {/* Buttons */}
        <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
          <Link
            href="/admin/testimonials"
            className="rounded-md border px-4 py-2 text-center text-sm font-medium hover:bg-gray-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Update Testimonial"}
          </button>
        </div>
      </form>
    </main>
  );
}