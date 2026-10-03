"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { adminProjectApi, Project } from "@/lib/api";

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

  const [beforeImage, setBeforeImage] = useState<File | null>(null);
  const [afterImage, setAfterImage] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof id !== "string" || !id) return;

    const projectId = id;
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

        setBeforeImage(null);
        setAfterImage(null);
        setImages([]);

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

  function handleBeforeImageChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0] ?? null;

    setError("");
    setBeforeImage(file);
  }

  function handleAfterImageChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0] ?? null;

    setError("");
    setAfterImage(file);
  }

  function handleImagesChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(
      event.target.files ?? []
    );

    if (files.length > 8) {
      setError(
        "You can add a maximum of 8 gallery images at a time."
      );
      setImages(files.slice(0, 8));
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

      // Replace Before image only when a new file is selected.
      if (beforeImage) {
        formData.append("beforeImage", beforeImage);
      }

      // Replace After image only when a new file is selected.
      if (afterImage) {
        formData.append("afterImage", afterImage);
      }

      // Add new gallery images.
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
                onChange={(e) =>
                  setTitle(e.target.value)
                }
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

              <p className="mt-1 text-xs text-gray-500">
                Separate materials with commas.
              </p>
            </div>
          </div>
        </section>

        {/* Transformation Images */}
        <section className="border-t border-gray-100 pt-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Transformation Images
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage the Before and After images used for the project
            transformation.
          </p>

          <div className="mt-5 grid gap-6 sm:grid-cols-2">
            {/* Before */}
            <div className="rounded-xl border border-gray-200 p-4">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Before
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    Original space
                  </p>
                </div>
              </div>

              {project.beforeImage ? (
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <div className="relative aspect-4/3 w-full">
                    <Image
                      src={project.beforeImage.url}
                      alt={
                        project.beforeImage.alt ||
                        `${project.title} before transformation`
                      }
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      void handleDeleteImage(
                        project.beforeImage!.publicId
                      )
                    }
                    className="w-full border-t border-gray-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                  >
                    Remove Before Image
                  </button>
                </div>
              ) : (
                <div className="flex aspect-4/3 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 text-sm text-gray-500">
                  No Before image
                </div>
              )}

              <div className="mt-4">
                <label
                  htmlFor="beforeImage"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  {project.beforeImage
                    ? "Replace Before Image"
                    : "Add Before Image"}
                </label>

                <input
                  id="beforeImage"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleBeforeImageChange}
                  className="block w-full rounded-lg border border-gray-300 p-3 text-sm"
                />

                {beforeImage && (
                  <p className="mt-2 truncate text-xs text-gray-500">
                    New file: {beforeImage.name}
                  </p>
                )}
              </div>
            </div>

            {/* After */}
            <div className="rounded-xl border border-gray-200 p-4">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    After
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    Completed transformation
                  </p>
                </div>
              </div>

              {project.afterImage ? (
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <div className="relative aspect-4/3 w-full">
                    <Image
                      src={project.afterImage.url}
                      alt={
                        project.afterImage.alt ||
                        `${project.title} after transformation`
                      }
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      void handleDeleteImage(
                        project.afterImage!.publicId
                      )
                    }
                    className="w-full border-t border-gray-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                  >
                    Remove After Image
                  </button>
                </div>
              ) : (
                <div className="flex aspect-4/3 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 text-sm text-gray-500">
                  No After image
                </div>
              )}

              <div className="mt-4">
                <label
                  htmlFor="afterImage"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  {project.afterImage
                    ? "Replace After Image"
                    : "Add After Image"}
                </label>

                <input
                  id="afterImage"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleAfterImageChange}
                  className="block w-full rounded-lg border border-gray-300 p-3 text-sm"
                />

                {afterImage && (
                  <p className="mt-2 truncate text-xs text-gray-500">
                    New file: {afterImage.name}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Images */}
        <section className="border-t border-gray-100 pt-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Gallery Images
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Additional project images beyond the Before and After
            transformation.
          </p>

          {project.images.length === 0 ? (
            <p className="mt-4 text-sm text-gray-500">
              No gallery images uploaded.
            </p>
          ) : (
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {project.images.map((image) => (
                <div
                  key={image.publicId}
                  className="overflow-hidden rounded-lg border border-gray-200"
                >
                  <div className="relative aspect-square w-full">
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
                      void handleDeleteImage(
                        image.publicId
                      )
                    }
                    className="w-full border-t border-gray-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                  >
                    Delete Image
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6">
            <label
              htmlFor="images"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Add New Gallery Images
            </label>

            <input
              id="images"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleImagesChange}
              className="block w-full rounded-lg border border-gray-300 p-3 text-sm"
            />

            <p className="mt-2 text-xs text-gray-500">
              Add up to 8 gallery images per update.
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