"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { publicProjectApi, type Project } from "@/lib/api";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function fetchProjects() {
      try {
        const result = await publicProjectApi.getProjects();

        if (!cancelled) {
          setProjects(result.items ?? []);
          setError("");
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setProjects([]);
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load projects."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void fetchProjects();

    return () => {
      cancelled = true;
    };
  }, [retryCount]);

  const handleRetry = () => {
    setError("");
    setLoading(true);
    setRetryCount((count) => count + 1);
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Our Interior Projects
          </h1>

          <p className="mt-2 text-gray-600">
            Explore completed interior projects and discover ideas
            for your own space.
          </p>
        </header>

        {/* Loading state */}
        {loading && (
          <div className="py-16 text-center">
            <p className="text-gray-600">Loading projects...</p>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="rounded-xl bg-red-50 p-6 text-center">
            <p className="text-red-700">{error}</p>

            <button
              type="button"
              onClick={handleRetry}
              className="mt-4 rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && projects.length === 0 && (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              No projects available yet
            </h2>

            <p className="mt-2 text-gray-600">
              Please check back later for our completed projects.
            </p>
          </div>
        )}

        {/* Project cards */}
        {!loading && !error && projects.length > 0 && (
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => {
              const image =
                project.afterImage?.url ||
                project.images?.[0]?.url;

              const imageAlt =
                project.afterImage?.alt ||
                project.images?.[0]?.alt ||
                project.title;

              return (
                <article
                  key={project._id}
                  className="overflow-hidden rounded-xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <Link href={`/projects/${project.slug}`}>
                    {/* Project image */}
                    <div className="relative aspect-4/3 overflow-hidden bg-gray-200">
                      {image ? (
                        <Image
                          src={image}
                          alt={imageAlt}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition duration-300 hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-gray-500">
                          No image available
                        </div>
                      )}

                      {project.featured && (
                        <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-900 shadow">
                          Featured
                        </span>
                      )}
                    </div>

                    {/* Project information */}
                    <div className="p-5">
                      <div className="mb-3 flex flex-wrap gap-2">
                        {project.category && (
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
                            {project.category}
                          </span>
                        )}

                        {project.style && (
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
                            {project.style}
                          </span>
                        )}
                      </div>

                      <h2 className="text-xl font-semibold text-gray-900">
                        {project.title}
                      </h2>

                      {project.location && (
                        <p className="mt-2 text-sm text-gray-500">
                          {project.location}
                        </p>
                      )}

                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
                        {project.description}
                      </p>

                      <span className="mt-5 inline-flex items-center font-medium text-gray-900">
                        View Project →
                      </span>
                    </div>
                  </Link>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}