"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { adminProjectApi } from "@/lib/api";

export default function NewProjectPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [style, setStyle] = useState("");
  const [materials, setMaterials] = useState("");
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(false);
  const [images, setImages] = useState<File[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function generateSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  function handleTitleChange(value: string) {
    setTitle(value);

    if (!slug) {
      setSlug(generateSlug(value));
    }
  }

  function handleImagesChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(event.target.files ?? []);

    if (files.length > 10) {
      setError("You can upload a maximum of 10 images.");
      setImages(files.slice(0, 10));
      return;
    }

    setError("");
    setImages(files);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (images.length > 10) {
      setError("You can upload a maximum of 10 images.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("title", title.trim());
      formData.append("slug", slug.trim());
      formData.append("description", description.trim());

      if (location.trim()) {
        formData.append("location", location.trim());
      }

      if (category.trim()) {
        formData.append("category", category.trim());
      }

      if (style.trim()) {
        formData.append("style", style.trim());
      }

      const materialList = materials
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      formData.append(
        "materials",
        JSON.stringify(materialList)
      );

      formData.append("featured", String(featured));
      formData.append("published", String(published));

      for (const image of images) {
        formData.append("images", image);
      }

      await adminProjectApi.createProject(formData);

      router.push("/admin/projects");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create project"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-8">
        <Link
          href="/admin/projects"
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          ← Back to Projects
        </Link>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
          Create New Project
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Add a completed or ongoing interior design project.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        {/* Basic Information */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900">
            Basic Information
          </h2>

          <div className="mt-4 grid gap-5">
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Project Title *
              </label>

              <input
                id="title"
                type="text"
                required
                minLength={3}
                value={title}
                onChange={(e) =>
                  handleTitleChange(e.target.value)
                }
                placeholder="Modern 3BHK Living Room"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-yellow-600"
              />
            </div>

            <div>
              <label
                htmlFor="slug"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Slug *
              </label>

              <input
                id="slug"
                type="text"
                required
                minLength={3}
                value={slug}
                onChange={(e) =>
                  setSlug(generateSlug(e.target.value))
                }
                placeholder="modern-3bhk-living-room"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-yellow-600"
              />

              <p className="mt-1 text-xs text-gray-500">
                Lowercase letters, numbers and hyphens only.
              </p>
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Description *
              </label>

              <textarea
                id="description"
                required
                minLength={10}
                rows={5}
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="Describe the project..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-yellow-600"
              />
            </div>
          </div>
        </section>

        {/* Project Details */}
        <section className="border-t border-gray-100 pt-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Project Details
          </h2>

          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="location"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Location
              </label>

              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) =>
                  setLocation(e.target.value)
                }
                placeholder="Noida, Uttar Pradesh"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-yellow-600"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Category
              </label>

              <input
                id="category"
                type="text"
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                placeholder="Residential"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-yellow-600"
              />
            </div>

            <div>
              <label
                htmlFor="style"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Style
              </label>

              <input
                id="style"
                type="text"
                value={style}
                onChange={(e) =>
                  setStyle(e.target.value)
                }
                placeholder="Modern"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-yellow-600"
              />
            </div>

            <div>
              <label
                htmlFor="materials"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Materials
              </label>

              <input
                id="materials"
                type="text"
                value={materials}
                onChange={(e) =>
                  setMaterials(e.target.value)
                }
                placeholder="Wood, Marble, Glass"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-yellow-600"
              />

              <p className="mt-1 text-xs text-gray-500">
                Separate materials with commas.
              </p>
            </div>
          </div>
        </section>

        {/* Images */}
        <section className="border-t border-gray-100 pt-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Project Images
          </h2>

          <div className="mt-4">
            <label
              htmlFor="images"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Images
            </label>

            <input
              id="images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImagesChange}
              className="block w-full rounded-lg border border-gray-300 p-3 text-sm"
            />

            <p className="mt-2 text-xs text-gray-500">
              Maximum 10 images.
            </p>

            {images.length > 0 && (
              <p className="mt-2 text-sm text-gray-700">
                {images.length} image
                {images.length !== 1 ? "s" : ""} selected
              </p>
            )}
          </div>
        </section>

        {/* Publishing */}
        <section className="border-t border-gray-100 pt-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Publishing
          </h2>

          <div className="mt-4 space-y-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) =>
                  setFeatured(e.target.checked)
                }
                className="h-4 w-4"
              />

              <span className="text-sm text-gray-700">
                Featured project
              </span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) =>
                  setPublished(e.target.checked)
                }
                className="h-4 w-4"
              />

              <span className="text-sm text-gray-700">
                Publish immediately
              </span>
            </label>
          </div>
        </section>

        {/* Actions */}
        <div className="flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-6">
          <Link
            href="/admin/projects"
            className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-yellow-600 px-6 py-3 text-sm font-semibold text-white hover:bg-yellow-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Project"}
          </button>
        </div>
      </form>
    </div>
  );
}