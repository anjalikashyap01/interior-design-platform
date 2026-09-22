"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { adminProjectApi, Project } from "@/lib/api";
import Image from "next/image";

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();

  const rawId = params.id;
  const id =
    typeof rawId === "string"
      ? rawId
      : Array.isArray(rawId)
        ? rawId[0]
        : undefined;

  const [project, setProject] = useState<Project | null>(null);

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

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Load project only when the ID is valid.
  useEffect(() => {
    if (typeof id !== "string" || !id) return;

    const projectId: string = id;
    let cancelled = false;

    async function loadProject() {
      try {
        const result =
          await adminProjectApi.getProject(projectId);

        if (cancelled) return;

        setProject(result);
        setTitle(result.title ?? "");
        setSlug(result.slug ?? "");
        setDescription(result.description ?? "");
        setLocation(result.location ?? "");
        setCategory(result.category ?? "");
        setStyle(result.style ?? "");
        setMaterials(result.materials?.join(", ") ?? "");

        setFeatured(Boolean(result.featured));
        setPublished(Boolean(result.published));
        setError("");
      } catch (err) {
        if (cancelled) return;

        setProject(null);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load project"
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadProject();

    return () => {
      cancelled = true;
    };
  }, [id]);

  function generateSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  function handleImagesChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(
      event.target.files ?? []
    );

    if (files.length > 10) {
      setError("You can upload a maximum of 10 images.");
      setImages(files.slice(0, 10));
      return;
    }

    setError("");
    setImages(files);
  }

  async function handleDeleteImage(publicId: string) {
    if (typeof id !== "string" || !id) {
      setError("Project ID is missing.");
      return;
    }

    const confirmed = window.confirm(
      "Delete this image? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      setError("");

      const updated =
        await adminProjectApi.deleteProjectImage(
          id,
          publicId
        );

      setProject(updated);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete project image"
      );
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (typeof id !== "string" || !id) {
      setError("Project ID is missing.");
      return;
    }

    setError("");
    setSaving(true);

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

      await adminProjectApi.updateProject(
        id,
        formData
      );

      router.push("/admin/projects");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update project"
      );
    } finally {
      setSaving(false);
    }
  }

  // Render missing-ID state directly, without setting state in an effect.
  if (typeof id !== "string" || !id) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700"
        >
          Project ID is missing.
        </div>

        <Link
          href="/admin/projects"
          className="mt-5 inline-block text-sm text-gray-600 hover:text-gray-900"
        >
          ← Back to Projects
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <p className="text-gray-500">
          Loading project...
        </p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700"
        >
          {error || "Project not found."}
        </div>

        <Link
          href="/admin/projects"
          className="mt-5 inline-block text-sm text-gray-600 hover:text-gray-900"
        >
          ← Back to Projects
        </Link>
      </div>
    );
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
          Edit Project
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Update project information, images and publishing status.
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
                onChange={(e) => setTitle(e.target.value)}
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
            </div>
          </div>
        </section>

        {/* Existing Images */}
        <section className="border-t border-gray-100 pt-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Existing Images
          </h2>

          {project.images.length === 0 ? (
            <p className="mt-3 text-sm text-gray-500">
              No images uploaded.
            </p>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {project.images.map((image) => (
  <div
    key={image.publicId}
    className="overflow-hidden rounded-lg border border-gray-200"
  >
    <div className="relative h-40 w-full">
      <Image
        src={image.url}
        alt={image.alt || project.title}
        fill
        sizes="(max-width: 640px) 50vw, 33vw"
        className="object-cover"
      />
    </div>

    <button
      type="button"
      onClick={() =>
        void handleDeleteImage(image.publicId)
      }
      className="w-full border-t border-gray-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
    >
      Delete Image
    </button>
  </div>
))}
            </div>
          )}
        </section>

        {/* Add Images */}
        <section className="border-t border-gray-100 pt-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Add New Images
          </h2>

          <div className="mt-4">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImagesChange}
              className="block w-full rounded-lg border border-gray-300 p-3 text-sm"
            />

            <p className="mt-2 text-xs text-gray-500">
              Maximum 10 new images per update.
            </p>

            {images.length > 0 && (
              <p className="mt-2 text-sm text-gray-700">
                {images.length} new image
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
                Published
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
            disabled={saving}
            className="rounded-lg bg-yellow-600 px-6 py-3 text-sm font-semibold text-white hover:bg-yellow-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}