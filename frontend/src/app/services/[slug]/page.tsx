"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  publicServiceApi,
  type Service,
} from "@/lib/api";

export default function ServiceDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchService() {
      try {
        const data = await publicServiceApi.getServiceBySlug(slug);

        if (!cancelled) {
          setService(data);
          setError("");
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setService(null);
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load service."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (slug) {
      void fetchService();
    }

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-16">
        <p>Loading service...</p>
      </main>
    );
  }

  if (error || !service) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-16">
        <p className="mb-4 text-red-600">
          {error || "Service not found."}
        </p>

        <Link
          href="/services"
          className="text-blue-600 underline"
        >
          Back to Services
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <Link
        href="/services"
        className="mb-8 inline-block text-sm text-blue-600 hover:underline"
      >
        ← Back to Services
      </Link>

      <div className="grid gap-10 md:grid-cols-2">
        <section>
          {service.image ? (
            <div className="relative h-56 w-full overflow-hidden rounded-xl bg-gray-100 sm:h-80">
              <Image
                src={service.image}
                alt={service.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex min-h-64 items-center justify-center rounded-xl bg-gray-100 text-gray-500">
              No image available
            </div>
          )}
        </section>

        <section>
          {service.featured && (
            <span className="mb-4 inline-block rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
              Featured Service
            </span>
          )}

          <h1 className="text-3xl font-bold md:text-5xl">
            {service.name}
          </h1>

          {service.shortDescription && (
            <p className="mt-4 text-lg text-gray-600">
              {service.shortDescription}
            </p>
          )}

          {service.startingPrice != null && (
            <p className="mt-6 text-xl font-semibold">
              Starting from ₹{service.startingPrice}
            </p>
          )}

          <div className="mt-8">
            <h2 className="mb-3 text-xl font-semibold">
              About This Service
            </h2>

            <p className="whitespace-pre-line leading-7 text-gray-700">
              {service.description}
            </p>
          </div>

          {service.features?.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-3 text-xl font-semibold">
                What’s Included
              </h2>

              <ul className="list-inside list-disc space-y-2 text-gray-700">
                {service.features.map((feature, index) => (
                  <li key={`${feature}-${index}`}>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Link
            href="/contact"
            className="mt-8 inline-block rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800"
          >
            Enquire About This Service
          </Link>
        </section>
      </div>
    </main>
  );
}