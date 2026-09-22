"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  publicProjectApi,
  type Project,
} from "@/lib/api";

export default function ProjectDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchProject() {
      try {
        const data = await publicProjectApi.getProjectBySlug(slug);

        if (!cancelled) {
          setProject(data);
          setError("");
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setProject(null);
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load project."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (slug) {
      void fetchProject();
    }

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-16">
        <p>Loading project...</p>
      </main>
    );
  }

  if (error || !project) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-16">
        <p className="mb-4 text-red-600">
          {error || "Project not found."}
        </p>

        <Link
          href="/projects"
          className="text-blue-600 underline"
        >
          Back to Projects
        </Link>
      </main>
    );
  }

  const galleryImages = [
    ...(project.beforeImage?.url
      ? [
          {
            url: project.beforeImage.url,
            alt: "Before renovation",
          },
        ]
      : []),

    ...(project.afterImage?.url
      ? [
          {
            url: project.afterImage.url,
            alt: "After renovation",
          },
        ]
      : []),

    ...(project.images || []).map((image) => ({
      url: image.url,
      alt: image.alt || project.title,
    })),
  ];

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <Link
        href="/projects"
        className="mb-8 inline-block text-sm text-blue-600 hover:underline"
      >
        ← Back to Projects
      </Link>

      <header className="mb-8">
        {project.featured && (
          <span className="mb-3 inline-block rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
            Featured Project
          </span>
        )}

        <h1 className="text-3xl font-bold md:text-5xl">
          {project.title}
        </h1>

        {project.location && (
          <p className="mt-3 text-gray-600">
            {project.location}
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          {project.category && (
            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
              {project.category}
            </span>
          )}

          {project.style && (
            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
              {project.style}
            </span>
          )}
        </div>
      </header>

      {galleryImages.length > 0 ? (
        <section className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-2">
          {galleryImages.map((image, index) => (
            <div
              key={`${image.url}-${index}`}
              className="relative overflow-hidden rounded-xl bg-gray-100"
            >
              <Image
                src={image.url}
                alt={image.alt}
                width={1200}
                height={800}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="max-h-130 w-full rounded-xl object-contain"
              />
            </div>
          ))}
        </section>
      ) : (
        <div className="mb-10 rounded-xl bg-gray-100 p-10 text-center text-gray-500">
          No project images available.
        </div>
      )}

      <section className="grid gap-10 md:grid-cols-[2fr_1fr]">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">
            About This Project
          </h2>

          <p className="whitespace-pre-line leading-7 text-gray-700">
            {project.description}
          </p>
        </div>

        {project.materials?.length > 0 && (
          <aside className="rounded-xl border p-6">
            <h2 className="mb-4 text-xl font-semibold">
              Materials Used
            </h2>

            <ul className="list-inside list-disc space-y-2 text-gray-700">
              {project.materials.map((material, index) => (
                <li key={`${material}-${index}`}>
                  {material}
                </li>
              ))}
            </ul>
          </aside>
        )}
      </section>
    </main>
  );
}