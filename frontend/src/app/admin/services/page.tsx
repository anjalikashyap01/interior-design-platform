"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  adminServiceApi,
  type Service,
} from "@/lib/api";
import Image from "next/image";

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await adminServiceApi.getServices();
      setServices(result.items);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load services"
      );
    } finally {
      setLoading(false);
    }
  }, []);

useEffect(() => {
  const timer = window.setTimeout(() => {
    void loadServices();
  }, 0);

  return () => {
    window.clearTimeout(timer);
  };
}, [loadServices]);

  const handlePublishToggle = async (service: Service) => {
    try {
      setActionLoading(service._id);
      setError("");

      if (service.status === "published") {
        await adminServiceApi.unpublishService(service._id);
      } else {
        await adminServiceApi.publishService(service._id);
      }

      await loadServices();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update service status"
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (service: Service) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${service.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(service._id);
      setError("");

      await adminServiceApi.deleteService(service._id);

      setServices((currentServices) =>
        currentServices.filter(
          (item) => item._id !== service._id
        )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete service"
      );
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <main className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Services
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your interior design services.
          </p>
        </div>

        <Link
          href="/admin/services/new"
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Add Service
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-lg border p-6 text-sm text-gray-500">
          Loading services...
        </div>
      ) : services.length === 0 ? (
        <div className="rounded-lg border p-10 text-center">
          <p className="text-gray-500">
            No services found.
          </p>

          <Link
            href="/admin/services/new"
            className="mt-4 inline-block rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Create your first service
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-semibold">
                    Service
                  </th>

                  <th className="px-4 py-3 font-semibold">
                    Slug
                  </th>

                  <th className="px-4 py-3 font-semibold">
                    Starting Price
                  </th>

                  <th className="px-4 py-3 font-semibold">
                    Featured
                  </th>

                  <th className="px-4 py-3 font-semibold">
                    Status
                  </th>

                  <th className="px-4 py-3 font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {services.map((service) => {
                  const isActionLoading =
                    actionLoading === service._id;

                  return (
                    <tr
                      key={service._id}
                      className="border-b last:border-b-0"
                    >
                     <td className="px-4 py-4">
  <div className="flex items-center gap-3">
    {service.image ? (
      <Image
        src={service.image}
        alt={service.name}
        className="h-16 w-16 rounded-lg object-cover"
        width={64}
        height={64}
      />
    ) : (
      <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-500">
        No image
      </div>
    )}

    <div className="min-w-0">
      <div className="font-medium">
        {service.name}
      </div>

      {service.shortDescription && (
        <div className="mt-1 max-w-xs truncate text-xs text-gray-500">
          {service.shortDescription}
        </div>
      )}
    </div>
  </div>
</td>

                      <td className="px-4 py-4 text-gray-600">
                        {service.slug}
                      </td>

                      <td className="px-4 py-4">
                        {service.startingPrice !==
                        undefined
                          ? `₹${service.startingPrice.toLocaleString(
                              "en-IN"
                            )}`
                          : "—"}
                      </td>

                      <td className="px-4 py-4">
                        {service.featured ? (
                          <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                            Yes
                          </span>
                        ) : (
                          <span className="text-gray-500">
                            No
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-4">
                        {service.status === "published" ? (
                          <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                            Published
                          </span>
                        ) : (
                          <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                            Draft
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          <Link
                            href={`/admin/services/${service._id}/edit`}
                            className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-gray-50"
                          >
                            Edit
                          </Link>

                          <button
                            type="button"
                            disabled={isActionLoading}
                            onClick={() =>
                              void handlePublishToggle(
                                service
                              )
                            }
                            className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isActionLoading
                              ? "Working..."
                              : service.status ===
                                  "published"
                                ? "Unpublish"
                                : "Publish"}
                          </button>

                          <button
                            type="button"
                            disabled={isActionLoading}
                            onClick={() =>
                              void handleDelete(service)
                            }
                            className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}