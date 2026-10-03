"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { adminDesignApi, type Design } from "@/lib/api";

type StatusFilter = "all" | "published" | "draft" | "archived";

export default function AdminDesignsPage() {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);

 useEffect(() => {
  let cancelled = false;

  const fetchDesigns = async () => {
    try {
      setError("");

      const data = await adminDesignApi.getDesigns();

      if (!cancelled) {
        setDesigns(data.items ?? []);
      }
    } catch (err) {
      console.error("Failed to load designs:", err);

      if (!cancelled) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load designs"
        );
      }
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  };

  fetchDesigns();

  return () => {
    cancelled = true;
  };
}, []);

  const filteredDesigns = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return designs.filter((design) => {
      const matchesSearch =
        !normalizedSearch ||
        design.title.toLowerCase().includes(normalizedSearch) ||
        design.slug.toLowerCase().includes(normalizedSearch) ||
        design.roomType.toLowerCase().includes(normalizedSearch) ||
        design.style.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "published" &&
          design.published &&
          !design.isArchived) ||
        (statusFilter === "draft" &&
          !design.published &&
          !design.isArchived) ||
        (statusFilter === "archived" &&
          design.isArchived);

      return matchesSearch && matchesStatus;
    });
  }, [designs, search, statusFilter]);

  const handleDelete = async (design: Design) => {
    const confirmed = window.confirm(
      `Delete "${design.title}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setActionId(design._id);
      setError("");

      await adminDesignApi.deleteDesign(design._id);

      setDesigns((current) =>
        current.filter((item) => item._id !== design._id)
      );
    } catch (err) {
      console.error("Failed to delete design:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete design"
      );
    } finally {
      setActionId(null);
    }
  };

  const handlePublishToggle = async (design: Design) => {
    try {
      setActionId(design._id);
      setError("");

      const updated = design.published
        ? await adminDesignApi.unpublishDesign(design._id)
        : await adminDesignApi.publishDesign(design._id);

      setDesigns((current) =>
        current.map((item) =>
          item._id === updated._id ? updated : item
        )
      );
    } catch (err) {
      console.error("Failed to update design status:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update design status"
      );
    } finally {
      setActionId(null);
    }
  };

  const handleArchiveToggle = async (design: Design) => {
    try {
      setActionId(design._id);
      setError("");

      const updated = design.isArchived
        ? await adminDesignApi.unarchiveDesign(design._id)
        : await adminDesignApi.archiveDesign(design._id);

      setDesigns((current) =>
        current.map((item) =>
          item._id === updated._id ? updated : item
        )
      );
    } catch (err) {
      console.error("Failed to update archive status:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update archive status"
      );
    } finally {
      setActionId(null);
    }
  };

  const publishedCount = designs.filter(
    (design) => design.published && !design.isArchived
  ).length;

  const draftCount = designs.filter(
    (design) => !design.published && !design.isArchived
  ).length;

  const archivedCount = designs.filter(
    (design) => design.isArchived
  ).length;

  return (
    <main className="min-h-screen bg-[#f7f7f5] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
              Admin / Designs
            </p>

            <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
              Design Management
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
              Create, edit, publish and manage the design collection
              displayed across the website.
            </p>
          </div>

          <Link
            href="/admin/designs/new"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-neutral-950 px-5 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            + Add Design
          </Link>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            label="Total Designs"
            value={designs.length}
          />

          <StatCard
            label="Published"
            value={publishedCount}
          />

          <StatCard
            label="Drafts"
            value={draftCount}
          />

          <StatCard
            label="Archived"
            value={archivedCount}
          />
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Toolbar */}
        <div className="mb-5 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search by title, room or style..."
                className="h-11 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-400 focus:bg-white"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <FilterButton
                active={statusFilter === "all"}
                onClick={() => setStatusFilter("all")}
              >
                All
              </FilterButton>

              <FilterButton
                active={statusFilter === "published"}
                onClick={() => setStatusFilter("published")}
              >
                Published
              </FilterButton>

              <FilterButton
                active={statusFilter === "draft"}
                onClick={() => setStatusFilter("draft")}
              >
                Drafts
              </FilterButton>

              <FilterButton
                active={statusFilter === "archived"}
                onClick={() => setStatusFilter("archived")}
              >
                Archived
              </FilterButton>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <LoadingState />
        ) : filteredDesigns.length === 0 ? (
          <EmptyState
            hasFilters={Boolean(search || statusFilter !== "all")}
            onClear={() => {
              setSearch("");
              setStatusFilter("all");
            }}
          />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
            {/* Desktop table */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-250">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50">
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      Design
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      Room
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      Style
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      Status
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      Features
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredDesigns.map((design) => (
                    <DesignTableRow
                      key={design._id}
                      design={design}
                      actionId={actionId}
                      onPublishToggle={handlePublishToggle}
                      onArchiveToggle={handleArchiveToggle}
                      onDelete={handleDelete}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile / tablet cards */}
            <div className="divide-y divide-neutral-200 lg:hidden">
              {filteredDesigns.map((design) => (
                <DesignMobileCard
                  key={design._id}
                  design={design}
                  actionId={actionId}
                  onPublishToggle={handlePublishToggle}
                  onArchiveToggle={handleArchiveToggle}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   FILTER BUTTON
========================================================= */

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3.5 py-2 text-sm font-medium transition ${
        active
          ? "bg-neutral-950 text-white"
          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
      }`}
    >
      {children}
    </button>
  );
}

/* =========================================================
   DESKTOP ROW
========================================================= */

function DesignTableRow({
  design,
  actionId,
  onPublishToggle,
  onArchiveToggle,
  onDelete,
}: {
  design: Design;
  actionId: string | null;
  onPublishToggle: (design: Design) => void;
  onArchiveToggle: (design: Design) => void;
  onDelete: (design: Design) => void;
}) {
  const busy = actionId === design._id;

  return (
    <tr className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50/70">
      <td className="px-5 py-4">
        <div className="flex items-center gap-4">
          <DesignThumbnail design={design} />

          <div className="min-w-0">
            <p className="truncate font-semibold text-neutral-900">
              {design.title}
            </p>

            <p className="mt-1 truncate text-xs text-neutral-400">
              /{design.slug}
            </p>
          </div>
        </div>
      </td>

      <td className="px-4 py-4 text-sm text-neutral-600">
        {formatValue(design.roomType)}
      </td>

      <td className="px-4 py-4 text-sm text-neutral-600">
        {formatValue(design.style)}
      </td>

      <td className="px-4 py-4">
        <StatusBadge design={design} />
      </td>

      <td className="px-4 py-4">
        <div className="flex flex-wrap gap-1.5">
          {design.featured && (
            <span className="rounded-md bg-amber-50 px-2 py-1 text-[11px] font-medium text-amber-700">
              Featured
            </span>
          )}

          {design.aiEnabled && (
            <span className="rounded-md bg-violet-50 px-2 py-1 text-[11px] font-medium text-violet-700">
              AI
            </span>
          )}
        </div>
      </td>

      <td className="px-5 py-4">
        <div className="flex items-center justify-end gap-2">
          <ActionButton
            href={`/admin/designs/${design._id}/edit`}
          >
            Edit
          </ActionButton>

          {!design.isArchived && (
            <button
              type="button"
              disabled={busy}
              onClick={() => onPublishToggle(design)}
              className="rounded-lg border border-neutral-200 px-3 py-2 text-xs font-medium text-neutral-700 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy
                ? "..."
                : design.published
                  ? "Unpublish"
                  : "Publish"}
            </button>
          )}

          <button
            type="button"
            disabled={busy}
            onClick={() => onArchiveToggle(design)}
            className="rounded-lg border border-neutral-200 px-3 py-2 text-xs font-medium text-neutral-700 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy
              ? "..."
              : design.isArchived
                ? "Restore"
                : "Archive"}
          </button>

          <button
            type="button"
            disabled={busy}
            onClick={() => onDelete(design)}
            className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

/* =========================================================
   MOBILE CARD
========================================================= */

function DesignMobileCard({
  design,
  actionId,
  onPublishToggle,
  onArchiveToggle,
  onDelete,
}: {
  design: Design;
  actionId: string | null;
  onPublishToggle: (design: Design) => void;
  onArchiveToggle: (design: Design) => void;
  onDelete: (design: Design) => void;
}) {
  const busy = actionId === design._id;

  return (
    <div className="p-4 sm:p-5">
      <div className="flex gap-4">
        <DesignThumbnail design={design} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-neutral-900">
                {design.title}
              </h3>

              <p className="mt-1 text-xs text-neutral-400">
                /{design.slug}
              </p>
            </div>

            <StatusBadge design={design} />
          </div>

          <div className="mt-3 flex flex-wrap gap-2 text-xs text-neutral-500">
            <span className="rounded-md bg-neutral-100 px-2 py-1">
              {formatValue(design.roomType)}
            </span>

            <span className="rounded-md bg-neutral-100 px-2 py-1">
              {formatValue(design.style)}
            </span>

            {design.featured && (
              <span className="rounded-md bg-amber-50 px-2 py-1 text-amber-700">
                Featured
              </span>
            )}

            {design.aiEnabled && (
              <span className="rounded-md bg-violet-50 px-2 py-1 text-violet-700">
                AI
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <ActionButton
          href={`/admin/designs/${design._id}/edit`}
        >
          Edit
        </ActionButton>

        {!design.isArchived && (
          <button
            type="button"
            disabled={busy}
            onClick={() => onPublishToggle(design)}
            className="rounded-lg border border-neutral-200 px-3 py-2 text-xs font-medium text-neutral-700 transition hover:bg-neutral-100 disabled:opacity-50"
          >
            {busy
              ? "..."
              : design.published
                ? "Unpublish"
                : "Publish"}
          </button>
        )}

        <button
          type="button"
          disabled={busy}
          onClick={() => onArchiveToggle(design)}
          className="rounded-lg border border-neutral-200 px-3 py-2 text-xs font-medium text-neutral-700 transition hover:bg-neutral-100 disabled:opacity-50"
        >
          {busy
            ? "..."
            : design.isArchived
              ? "Restore"
              : "Archive"}
        </button>

        <button
          type="button"
          disabled={busy}
          onClick={() => onDelete(design)}
          className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   THUMBNAIL
========================================================= */

function DesignThumbnail({
  design,
}: {
  design: Design;
}) {
  const image = design.images?.[0];

  if (!image?.url) {
    return (
      <div className="flex h-16 w-20 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-[10px] font-medium uppercase tracking-wider text-neutral-400">
        No image
      </div>
    );
  }

  return (
    <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
      <Image
        src={image.url}
        alt={image.alt || design.title}
        fill
        sizes="80px"
        className="object-cover"
      />
    </div>
  );
}

/* =========================================================
   STATUS
========================================================= */

function StatusBadge({
  design,
}: {
  design: Design;
}) {
  if (design.isArchived) {
    return (
      <span className="inline-flex rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold text-neutral-500">
        Archived
      </span>
    );
  }

  if (design.published) {
    return (
      <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
        Published
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-semibold text-orange-700">
      Draft
    </span>
  );
}

/* =========================================================
   ACTION LINK
========================================================= */

function ActionButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-lg border border-neutral-200 px-3 py-2 text-xs font-medium text-neutral-700 transition hover:bg-neutral-100"
    >
      {children}
    </Link>
  );
}

/* =========================================================
   LOADING
========================================================= */

function LoadingState() {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center shadow-sm">
      <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-900" />

      <p className="mt-4 text-sm text-neutral-500">
        Loading designs...
      </p>
    </div>
  );
}

/* =========================================================
   EMPTY
========================================================= */

function EmptyState({
  hasFilters,
  onClear,
}: {
  hasFilters: boolean;
  onClear: () => void;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-neutral-300 bg-white px-6 py-16 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-xl">
        ◇
      </div>

      <h2 className="mt-4 text-lg font-semibold text-neutral-900">
        {hasFilters
          ? "No matching designs"
          : "No designs yet"}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-500">
        {hasFilters
          ? "Try changing your search or status filter."
          : "Create your first design to start building the portfolio."}
      </p>

      {hasFilters ? (
        <button
          type="button"
          onClick={onClear}
          className="mt-5 rounded-lg bg-neutral-950 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
        >
          Clear filters
        </button>
      ) : (
        <Link
          href="/admin/designs/new"
          className="mt-5 inline-flex rounded-lg bg-neutral-950 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
        >
          Add your first design
        </Link>
      )}
    </div>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function formatValue(value: string) {
  if (!value) return "—";

  return value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase()
    );
}