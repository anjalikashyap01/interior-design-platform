"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  adminDashboardApi,
  type AdminDashboardData,
  type AdminDashboardConsultation,
} from "@/lib/api";

const formatConsultationStatus = (
  status: AdminDashboardConsultation["status"]
) => {
  switch (status) {
    case "pending":
      return "New";
    case "contacted":
      return "Contacted";
    case "confirmed":
      return "Confirmed";
    case "completed":
      return "Completed";
    case "cancelled":
      return "Cancelled";
    default:
      return status;
  }
};

const formatConsultationType = (
  type: AdminDashboardConsultation["consultationType"]
) => {
  switch (type) {
    case "online":
      return "Online";
    case "phone":
      return "Phone";
    case "site_visit":
      return "Site Visit";
    default:
      return type;
  }
};

const formatDate = (date?: string) => {
  if (!date) {
    return "Date not provided";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date not available";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getStatusClasses = (
  status: AdminDashboardConsultation["status"]
) => {
  switch (status) {
    case "pending":
      return "border-[#D9B66F] bg-[#FBF4E5] text-[#8A6724]";
    case "contacted":
      return "border-[#B9C3A0] bg-[#F0F3E9] text-[#59663A]";
    case "confirmed":
      return "border-[#AFC2A5] bg-[#EEF4EC] text-[#4E6848]";
    default:
      return "border-[#DDD7CB] bg-[#F5F2EC] text-[#6F6A60]";
  }
};

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] =
    useState<AdminDashboardData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingConsultationId, setUpdatingConsultationId] =
    useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await adminDashboardApi.getDashboard();

      setDashboard(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadDashboard();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadDashboard]);

  const handleCompleteConsultation = async (
    consultationId: string
  ) => {
    try {
      setUpdatingConsultationId(consultationId);
      setError("");

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL ||
          "http://localhost:5000/api"
        }/admin/consultations/${consultationId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem(
              "adminToken"
            )}`,
          },
          body: JSON.stringify({
            status: "completed",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to complete consultation"
        );
      }

      await loadDashboard();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to complete consultation"
      );
    } finally {
      setUpdatingConsultationId(null);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-9">
          <div className="h-3 w-20 animate-pulse rounded bg-[#D8C9A8]" />

          <div className="mt-4 h-9 w-52 animate-pulse rounded bg-[#D8C9A8]/70" />

          <div className="mt-3 h-4 w-80 max-w-full animate-pulse rounded bg-[#D8C9A8]/50" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-40 animate-pulse rounded-xl border border-[#DDD5C6] bg-[#FFFDF8]"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="mx-auto w-full max-w-7xl">
        <div className="rounded-xl border border-[#D9B5B0] bg-[#FBF2F0] p-6">
          <h1 className="text-xl font-semibold text-[#743F3A]">
            Unable to load dashboard
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#8C5C56]">
            {error || "Dashboard data is unavailable."}
          </p>

          <button
            type="button"
            onClick={() => void loadDashboard()}
            className="mt-5 rounded-lg bg-[#4F5B2A] px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#3F491F] focus:outline-none focus:ring-2 focus:ring-[#B8892D]/50 focus:ring-offset-2"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const { counts, consultations } = dashboard;

  return (
    <div className="mx-auto w-full max-w-7xl">
      {/* Page Heading */}
      <div className="mb-9">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#B8892D]">
          Studio Overview
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.02em] text-[#3F491F] sm:text-4xl">
          Dashboard
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#756F67]">
          Manage your interior design platform from one place.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-7 flex items-start gap-3 rounded-xl border border-[#D9B5B0] bg-[#FBF2F0] px-4 py-3.5 text-sm text-[#743F3A]">
          <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-[#A85C5C]" />
          <span>{error}</span>
        </div>
      )}

      {/* Overview */}
      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[#3F491F]">
              Overview
            </h2>

            <p className="mt-1 text-sm text-[#756F67]">
              Current content across your platform.
            </p>
          </div>

          <div className="hidden h-px flex-1 bg-[#D8C9A8]/70 sm:block" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* Designs */}
          <div className="group rounded-xl border border-[#D8CDBB] bg-[#FFFDF8] p-6 shadow-[0_4px_18px_rgba(63,73,31,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#B8892D]/50 hover:shadow-[0_10px_28px_rgba(63,73,31,0.08)]">
            <div className="flex items-start justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#756F67]">
                Designs
              </p>

              <span className="h-2 w-2 rounded-full bg-[#B8892D]" />
            </div>

            <p className="mt-5 text-3xl font-semibold tracking-tight text-[#3F491F]">
              {counts.designs.total}
            </p>

            <p className="mt-2 text-sm text-[#756F67]">
              <span className="font-medium text-[#59663A]">
                {counts.designs.published}
              </span>{" "}
              published
            </p>

            <Link
              href="/admin/designs"
              className="mt-6 inline-flex items-center text-sm font-semibold text-[#4F5B2A] transition-colors duration-200 hover:text-[#B8892D]"
            >
              Manage Designs
              <span className="ml-1.5 transition-transform duration-200 group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </div>

          {/* Projects */}
          <div className="group rounded-xl border border-[#D8CDBB] bg-[#FFFDF8] p-6 shadow-[0_4px_18px_rgba(63,73,31,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#B8892D]/50 hover:shadow-[0_10px_28px_rgba(63,73,31,0.08)]">
            <div className="flex items-start justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#756F67]">
                Projects
              </p>

              <span className="h-2 w-2 rounded-full bg-[#4F5B2A]" />
            </div>

            <p className="mt-5 text-3xl font-semibold tracking-tight text-[#3F491F]">
              {counts.projects.total}
            </p>

            <p className="mt-2 text-sm text-[#756F67]">
              <span className="font-medium text-[#59663A]">
                {counts.projects.published}
              </span>{" "}
              published
            </p>

            <Link
              href="/admin/projects"
              className="mt-6 inline-flex items-center text-sm font-semibold text-[#4F5B2A] transition-colors duration-200 hover:text-[#B8892D]"
            >
              Manage Projects
              <span className="ml-1.5 transition-transform duration-200 group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </div>

          {/* Services */}
          <div className="group rounded-xl border border-[#D8CDBB] bg-[#FFFDF8] p-6 shadow-[0_4px_18px_rgba(63,73,31,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#B8892D]/50 hover:shadow-[0_10px_28px_rgba(63,73,31,0.08)]">
            <div className="flex items-start justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#756F67]">
                Services
              </p>

              <span className="h-2 w-2 rounded-full bg-[#B8892D]" />
            </div>

            <p className="mt-5 text-3xl font-semibold tracking-tight text-[#3F491F]">
              {counts.services.total}
            </p>

            <p className="mt-2 text-sm text-[#756F67]">
              <span className="font-medium text-[#59663A]">
                {counts.services.published}
              </span>{" "}
              published
            </p>

            <Link
              href="/admin/services"
              className="mt-6 inline-flex items-center text-sm font-semibold text-[#4F5B2A] transition-colors duration-200 hover:text-[#B8892D]"
            >
              Manage Services
              <span className="ml-1.5 transition-transform duration-200 group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </div>

          {/* Testimonials */}
          <div className="group rounded-xl border border-[#D8CDBB] bg-[#FFFDF8] p-6 shadow-[0_4px_18px_rgba(63,73,31,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#B8892D]/50 hover:shadow-[0_10px_28px_rgba(63,73,31,0.08)]">
            <div className="flex items-start justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#756F67]">
                Testimonials
              </p>

              <span className="h-2 w-2 rounded-full bg-[#4F5B2A]" />
            </div>

            <p className="mt-5 text-3xl font-semibold tracking-tight text-[#3F491F]">
              {counts.testimonials.total}
            </p>

            <p className="mt-2 text-sm text-[#756F67]">
              <span className="font-medium text-[#59663A]">
                {counts.testimonials.published}
              </span>{" "}
              published
            </p>

            <Link
              href="/admin/testimonials"
              className="mt-6 inline-flex items-center text-sm font-semibold text-[#4F5B2A] transition-colors duration-200 hover:text-[#B8892D]"
            >
              Manage Testimonials
              <span className="ml-1.5 transition-transform duration-200 group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Consultations */}
      <section className="mt-12">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[#3F491F]">
              Consultations
            </h2>

            <p className="mt-1 text-sm text-[#756F67]">
              Only active consultations appear below. Completed
              consultations remain stored in the database.
            </p>
          </div>

          <div className="hidden h-px flex-1 bg-[#D8C9A8]/70 sm:block" />
        </div>

        {/* Consultation Summary */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* New */}
          <div className="rounded-xl border border-[#D9B66F]/70 bg-[#FBF4E5] p-6 transition-shadow duration-300 hover:shadow-[0_8px_24px_rgba(184,137,45,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8A6724]">
              New
            </p>

            <p className="mt-4 text-3xl font-semibold text-[#604B20]">
              {consultations.new}
            </p>

            <p className="mt-2 text-sm text-[#8A6724]">
              Awaiting admin action
            </p>
          </div>

          {/* In Progress */}
          <div className="rounded-xl border border-[#B9C3A0] bg-[#F0F3E9] p-6 transition-shadow duration-300 hover:shadow-[0_8px_24px_rgba(79,91,42,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#59663A]">
              In Progress
            </p>

            <p className="mt-4 text-3xl font-semibold text-[#3F491F]">
              {consultations.inProgress}
            </p>

            <p className="mt-2 text-sm text-[#59663A]">
              Contacted or confirmed
            </p>
          </div>

          {/* Completed */}
          <div className="rounded-xl border border-[#D8CDBB] bg-[#FFFDF8] p-6 transition-shadow duration-300 hover:shadow-[0_8px_24px_rgba(63,73,31,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#756F67]">
              Completed
            </p>

            <p className="mt-4 text-3xl font-semibold text-[#3F491F]">
              {consultations.completed}
            </p>

            <p className="mt-2 text-sm text-[#756F67]">
              Preserved in consultation history
            </p>
          </div>
        </div>
      </section>

      {/* Active Consultations */}
      <section className="mt-12">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[#3F491F]">
              Active Consultations
            </h2>

            <p className="mt-1 text-sm text-[#756F67]">
              The latest consultations that still need attention.
            </p>
          </div>

          <div className="hidden h-px flex-1 bg-[#D8C9A8]/70 sm:block" />
        </div>

        {consultations.recentActive.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#D8CDBB] bg-[#FFFDF8] px-6 py-12 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-[#D8C9A8] bg-[#F5EFE3] text-[#B8892D]">
              —
            </div>

            <p className="mt-4 text-base font-semibold text-[#3F491F]">
              No active consultations
            </p>

            <p className="mt-2 text-sm text-[#756F67]">
              New consultation requests will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {consultations.recentActive.map(
              (consultation) => (
                <div
                  key={consultation._id}
                  className="group rounded-xl border border-[#D8CDBB] bg-[#FFFDF8] p-5 shadow-[0_3px_14px_rgba(63,73,31,0.035)] transition-all duration-300 hover:border-[#B8892D]/40 hover:shadow-[0_8px_24px_rgba(63,73,31,0.07)]"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-base font-semibold text-[#3F491F]">
                          {consultation.name}
                        </h3>

                        <span
                          className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${getStatusClasses(
                            consultation.status
                          )}`}
                        >
                          {formatConsultationStatus(
                            consultation.status
                          )}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-2.5 text-sm text-[#756F67] sm:grid-cols-2">
                        <p>
                          <span className="font-medium text-[#4B4842]">
                            Phone:
                          </span>{" "}
                          {consultation.phone}
                        </p>

                        {consultation.email && (
                          <p>
                            <span className="font-medium text-[#4B4842]">
                              Email:
                            </span>{" "}
                            {consultation.email}
                          </p>
                        )}

                        <p>
                          <span className="font-medium text-[#4B4842]">
                            Type:
                          </span>{" "}
                          {formatConsultationType(
                            consultation.consultationType
                          )}
                        </p>

                        <p>
                          <span className="font-medium text-[#4B4842]">
                            Submitted:
                          </span>{" "}
                          {formatDate(
                            consultation.createdAt
                          )}
                        </p>

                        {consultation.city && (
                          <p>
                            <span className="font-medium text-[#4B4842]">
                              City:
                            </span>{" "}
                            {consultation.city}
                          </p>
                        )}

                        {consultation.preferredDate && (
                          <p>
                            <span className="font-medium text-[#4B4842]">
                              Preferred Date:
                            </span>{" "}
                            {formatDate(
                              consultation.preferredDate
                            )}
                          </p>
                        )}

                        {consultation.preferredTime && (
                          <p>
                            <span className="font-medium text-[#4B4842]">
                              Preferred Time:
                            </span>{" "}
                            {consultation.preferredTime}
                          </p>
                        )}
                      </div>

                      {consultation.message && (
                        <p className="mt-4 border-l-2 border-[#D8C9A8] bg-[#F8F5EE] px-4 py-3 text-sm leading-6 text-[#756F67]">
                          {consultation.message}
                        </p>
                      )}
                    </div>

                    <div className="shrink-0 border-t border-[#E5DED2] pt-4 lg:border-0 lg:pt-0">
                      <button
                        type="button"
                        onClick={() =>
                          void handleCompleteConsultation(
                            consultation._id
                          )
                        }
                        disabled={
                          updatingConsultationId ===
                          consultation._id
                        }
                        className="w-full rounded-lg border border-[#4F5B2A] bg-[#4F5B2A] px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#3F491F] hover:shadow-md hover:shadow-[#4F5B2A]/15 focus:outline-none focus:ring-2 focus:ring-[#B8892D]/40 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 lg:w-auto"
                      >
                        {updatingConsultationId ===
                        consultation._id
                          ? "Completing..."
                          : "Mark Completed"}
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
}