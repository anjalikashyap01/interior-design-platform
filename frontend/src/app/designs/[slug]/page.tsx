"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { publicDesignApi, type Design } from "@/lib/api";

export default function DesignDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [design, setDesign] = useState<Design | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function fetchDesign() {
      try {
        const result = await publicDesignApi.getDesignBySlug(slug);

        if (!cancelled) {
          setDesign(result);
          setError("");
          setLoading(false);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setDesign(null);
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load design."
          );
          setLoading(false);
        }
      }
    }

    if (slug) {
      void fetchDesign();
    }

    return () => {
      cancelled = true;
    };
  }, [slug, retryCount]);

  const handleRetry = () => {
    setError("");
    setLoading(true);
    setRetryCount((count) => count + 1);
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading design...</p>
      </main>
    );
  }

  if (!slug || error || !design) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">
            Design not found
          </h1>

          <p className="mt-3 text-gray-600">
            {!slug
              ? "Design slug is missing."
              : error || "This design may no longer be available."}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/designs"
              className="rounded-lg bg-gray-900 px-5 py-3 text-white hover:bg-gray-700"
            >
              Back to Designs
            </Link>

            {slug && (
              <button
                type="button"
                onClick={handleRetry}
                className="rounded-lg border border-gray-300 px-5 py-3 text-gray-800 hover:bg-gray-100"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </main>
    );
  }

  const images = design.images ?? [];

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/designs"
          className="mb-8 inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          ← Back to Designs
        </Link>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Design images */}
          <section>
            {images.length > 0 ? (
              <div className="space-y-4">
                <div className="overflow-hidden rounded-2xl bg-gray-200">
                  <Image
                    src={images[0].url}
                    alt={images[0].alt || design.title}
                    width={1200}
                    height={900}
                    priority
                    className="aspect-4/3 w-full object-cover"
                  />
                </div>

                {images.length > 1 && (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {images.slice(1).map((image, index) => (
                      <div
                        key={`${image.publicId}-${index}`}
                        className="overflow-hidden rounded-xl bg-gray-200"
                      >
                        <Image
                          src={image.url}
                          alt={
                            image.alt ||
                            `${design.title} image ${index + 2}`
                          }
                          width={600}
                          height={600}
                          className="aspect-square w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex aspect-4/3 items-center justify-center rounded-2xl bg-gray-200 text-gray-500">
                No images available
              </div>
            )}
          </section>

          {/* Design information */}
          <section>
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-gray-200 px-3 py-1 text-sm text-gray-700">
                {design.roomType}
              </span>

              <span className="rounded-full bg-gray-200 px-3 py-1 text-sm text-gray-700">
                {design.style}
              </span>

              {design.featured && (
                <span className="rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-800">
                  Featured
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              {design.title}
            </h1>

            <p className="mt-5 whitespace-pre-line leading-7 text-gray-600">
              {design.description}
            </p>

            {/* Budget */}
            {(design.budgetMin !== undefined ||
              design.budgetMax !== undefined) && (
              <div className="mt-8 rounded-xl border border-gray-200 bg-white p-5">
                <h2 className="text-lg font-semibold text-gray-900">
                  Estimated Budget
                </h2>

                <p className="mt-2 text-xl font-bold text-gray-900">
                  {design.budgetMin !== undefined
                    ? `₹${design.budgetMin.toLocaleString("en-IN")}`
                    : "—"}
                  {" – "}
                  {design.budgetMax !== undefined
                    ? `₹${design.budgetMax.toLocaleString("en-IN")}`
                    : "—"}
                </p>
              </div>
            )}

            {/* Colors */}
            {design.colors && design.colors.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-900">
                  Color Preferences
                </h2>

                <div className="mt-3 flex flex-wrap gap-2">
                  {design.colors.map((color) => (
                    <span
                      key={color}
                      className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700"
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Materials */}
            {design.materials && design.materials.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-900">
                  Materials
                </h2>

                <div className="mt-3 flex flex-wrap gap-2">
                  {design.materials.map((material) => (
                    <span
                      key={material}
                      className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700"
                    >
                      {material}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {design.tags && design.tags.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-900">
                  Tags
                </h2>

                <div className="mt-3 flex flex-wrap gap-2">
                  {design.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <Link
              href="/designs"
              className="mt-10 inline-block rounded-lg bg-gray-900 px-6 py-3 font-medium text-white hover:bg-gray-700"
            >
              Explore More Designs
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}