
"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState, type ChangeEvent, } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  adminServiceApi,
  type Service,
} from "@/lib/api";

export default function EditServicePage() {
  const params = useParams();
  const router = useRouter();

  const serviceId = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const [service, setService] = useState<Service | null>(
    null
  );

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [shortDescription, setShortDescription] =
    useState("");

  // Existing image URL
  const [image, setImage] = useState("");

  // New image selected from computer
  const [imageFile, setImageFile] =
    useState<File | null>(null);

  // Preview URL for newly selected image
  
  const [startingPrice, setStartingPrice] =
    useState("");
  const [features, setFeatures] = useState("");
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<
    "draft" | "published"
  >("draft");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadService = useCallback(async () => {
    if (!serviceId) {
      setError("Service ID is missing");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result =
        await adminServiceApi.getService(serviceId);

      setService(result);
      setName(result.name);
      setSlug(result.slug);
      setDescription(result.description);
      setShortDescription(
        result.shortDescription ?? ""
      );
      setImage(result.image ?? "");

      setImageFile(null);
      

      setStartingPrice(
        result.startingPrice !== undefined
          ? String(result.startingPrice)
          : ""
      );

      setFeatures(result.features.join(", "));
      setFeatured(result.featured);
      setStatus(result.status);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load service"
      );
    } finally {
      setLoading(false);
    }
  }, [serviceId]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadService();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadService]);

  // Create a preview URL whenever a new image is selected.
 const imagePreview = useMemo(() => { if (!imageFile) { return ""; } return URL.createObjectURL(imageFile); }, [imageFile]); useEffect(() => { if (!imagePreview) { return; } return () => { URL.revokeObjectURL(imagePreview); }; }, [imagePreview]);

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile =
      event.target.files?.[0] ?? null;

    setImageFile(selectedFile);
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!serviceId) {
      setError("Service ID is missing");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const featureList = features
        .split(",")
        .map((feature) => feature.trim())
        .filter(Boolean);

      const formData = new FormData();

      formData.append("name", name.trim());

      formData.append(
        "slug",
        slug.trim().toLowerCase()
      );

      formData.append(
        "description",
        description.trim()
      );

      formData.append(
        "shortDescription",
        shortDescription.trim()
      );

      formData.append(
        "features",
        JSON.stringify(featureList)
      );

      formData.append(
        "featured",
        String(featured)
      );

      formData.append("status", status);

      if (startingPrice.trim()) {
        formData.append(
          "startingPrice",
          startingPrice.trim()
        );
      }

      // Upload a new image only when one was selected.
      if (imageFile) {
        formData.append("image", imageFile);
      }

      await adminServiceApi.updateService(
        serviceId,
        formData
      );

      router.push("/admin/services");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update service"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="p-6">
        <div className="rounded-lg border p-6 text-sm text-gray-500">
          Loading service...
        </div>
      </main>
    );
  }

  if (!service) {
    return (
      <main className="p-6">
        <Link
          href="/admin/services"
          className="text-sm text-gray-500 hover:text-black"
        >
          ← Back to Services
        </Link>

        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error || "Service not found"}
        </div>
      </main>
    );
  }

  return (
    <main className="p-6">
      <div className="mb-6">
        <Link
          href="/admin/services"
          className="text-sm text-gray-500 hover:text-black"
        >
          ← Back to Services
        </Link>

        <h1 className="mt-3 text-2xl font-bold">
          Edit Service
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Update the service details.
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl space-y-6 rounded-lg border bg-white p-6"
      >
        {/* Service Name */}
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium"
          >
            Service Name *
          </label>

          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            required
            maxLength={150}
            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-black"
          />
        </div>

        {/* Slug */}
        <div>
          <label
            htmlFor="slug"
            className="mb-2 block text-sm font-medium"
          >
            Slug *
          </label>

          <input
            id="slug"
            type="text"
            value={slug}
            onChange={(event) =>
              setSlug(event.target.value)
            }
            required
            maxLength={180}
            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-black"
          />

          <p className="mt-1 text-xs text-gray-500">
            Use lowercase letters, numbers, and hyphens.
          </p>
        </div>

        {/* Short Description */}
        <div>
          <label
            htmlFor="shortDescription"
            className="mb-2 block text-sm font-medium"
          >
            Short Description
          </label>

          <input
            id="shortDescription"
            type="text"
            value={shortDescription}
            onChange={(event) =>
              setShortDescription(event.target.value)
            }
            maxLength={300}
            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-black"
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium"
          >
            Description *
          </label>

          <textarea
            id="description"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            required
            minLength={10}
            maxLength={5000}
            rows={6}
            className="w-full resize-y rounded-lg border px-3 py-2 outline-none focus:border-black"
          />
        </div>

        {/* Service Image */}
        <div>
          <label
            htmlFor="image"
            className="mb-2 block text-sm font-medium"
          >
            Service Image
          </label>

          <input
            id="image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />

          <p className="mt-1 text-xs text-gray-500">
            JPG, PNG or WEBP. Maximum size: 5 MB.
          </p>

          {/* Current Image */}
          {image && !imageFile && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-medium text-gray-500">
                Current image
              </p>

              <Image
                src={image}
                alt={
                  name || "Current service image"
                }
                width={128}
                height={128}
                className="h-32 w-32 rounded-lg object-cover"
              />
            </div>
          )}

          {/* New Image Preview */}
          {imageFile && imagePreview && ( <div className="mt-4"> <p className="mb-2 text-xs font-medium text-gray-500"> New image selected </p> <Image src={imagePreview} alt="New service preview" width={128} height={128} unoptimized className="h-32 w-32 rounded-lg object-cover" /> <p className="mt-2 text-sm text-gray-600"> {imageFile.name} </p> </div> )}
        </div>

        {/* Starting Price */}
        <div>
          <label
            htmlFor="startingPrice"
            className="mb-2 block text-sm font-medium"
          >
            Starting Price
          </label>

          <input
            id="startingPrice"
            type="number"
            min="0"
            step="1"
            value={startingPrice}
            onChange={(event) =>
              setStartingPrice(event.target.value)
            }
            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-black"
          />
        </div>

        {/* Features */}
        <div>
          <label
            htmlFor="features"
            className="mb-2 block text-sm font-medium"
          >
            Features
          </label>

          <textarea
            id="features"
            value={features}
            onChange={(event) =>
              setFeatures(event.target.value)
            }
            rows={4}
            placeholder="3D design, Material selection, Space planning"
            className="w-full resize-y rounded-lg border px-3 py-2 outline-none focus:border-black"
          />

          <p className="mt-1 text-xs text-gray-500">
            Separate each feature with a comma.
          </p>
        </div>

        {/* Featured */}
        <div className="flex items-center gap-3">
          <input
            id="featured"
            type="checkbox"
            checked={featured}
            onChange={(event) =>
              setFeatured(event.target.checked)
            }
            className="h-4 w-4"
          />

          <label
            htmlFor="featured"
            className="text-sm font-medium"
          >
            Featured Service
          </label>
        </div>

        {/* Status */}
        <div>
          <label
            htmlFor="status"
            className="mb-2 block text-sm font-medium"
          >
            Status
          </label>

          <select
            id="status"
            value={status}
            onChange={(event) =>
              setStatus(
                event.target.value as
                  | "draft"
                  | "published"
              )
            }
            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-black"
          >
            <option value="draft">Draft</option>
            <option value="published">
              Published
            </option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex gap-3 border-t pt-5">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

          <Link
            href="/admin/services"
            className="rounded-lg border px-5 py-2.5 text-sm font-medium hover:bg-gray-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}

