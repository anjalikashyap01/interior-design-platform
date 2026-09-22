"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  publicServiceApi,
  type Service,
} from "@/lib/api";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function fetchServices() {
      try {
        const result = await publicServiceApi.getServices();

        if (!cancelled) {
          setServices(result.items ?? []);
          setError("");
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setServices([]);
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load services."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void fetchServices();

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
    <main className="mx-auto max-w-6xl px-6 py-12">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-bold md:text-5xl">
          Our Interior Design Services
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-gray-600">
          Explore our interior design services and find
          the right solution for your space.
        </p>
      </header>

      {/* Loading state */}
      {loading && (
        <p className="py-12 text-center">
          Loading services...
        </p>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="py-12 text-center">
          <p className="mb-4 text-red-600">{error}</p>

          <button
            type="button"
            onClick={handleRetry}
            className="rounded-lg bg-black px-5 py-2 text-white hover:bg-gray-800"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && services.length === 0 && (
        <p className="py-12 text-center text-gray-500">
          No services are currently available.
        </p>
      )}

      {/* Service cards */}
      {!loading && !error && services.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <article
              key={service._id}
              className="overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md"
            >
              {service.image ? (
                <div className="relative h-56 w-full bg-gray-100">
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-56 items-center justify-center bg-gray-100 text-gray-400">
                  No image available
                </div>
              )}

              <div className="p-6">
                {service.featured && (
                  <span className="mb-3 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                    Featured
                  </span>
                )}

                <h2 className="text-xl font-semibold">
                  {service.name}
                </h2>

                <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
                  {service.shortDescription ||
                    service.description}
                </p>

                {service.startingPrice != null && (
                  <p className="mt-4 font-medium">
                    Starting from ₹{service.startingPrice}
                  </p>
                )}

                <Link
                  href={`/services/${service.slug}`}
                  className="mt-5 inline-block rounded-lg bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800"
                >
                  View Details
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}