"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

import {
  publicProjectApi,
  type Project,
} from "@/lib/api";

import "@fontsource/berkshire-swash/400.css";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";

export default function ProjectDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =====================================================
      FULL DOCUMENT SCROLL BEHAVIOR
  ====================================================== */

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    const previousRootBackground =
      root.style.backgroundColor;

    const previousBodyBackground =
      body.style.backgroundColor;

    const previousRootOverscroll =
      root.style.overscrollBehavior;

    const previousBodyOverscroll =
      body.style.overscrollBehavior;

    const previousRootOverflowX =
      root.style.overflowX;

    const previousBodyOverflowX =
      body.style.overflowX;

    const previousRootOverflowY =
      root.style.overflowY;

    const previousBodyOverflowY =
      body.style.overflowY;

    const previousRootTouchAction =
      root.style.touchAction;

    const previousBodyTouchAction =
      body.style.touchAction;

    const previousRootHeight =
      root.style.height;

    const previousBodyMinHeight =
      body.style.minHeight;

    const previousBodyOverflow =
      body.style.overflow;

    root.style.backgroundColor = "#FFF7E8";
    body.style.backgroundColor = "#FFF7E8";

    root.style.setProperty(
      "overflow-x",
      "hidden",
      "important"
    );

    root.style.setProperty(
      "overflow-y",
      "scroll",
      "important"
    );

    root.style.setProperty(
      "overscroll-behavior-y",
      "none",
      "important"
    );

    root.style.setProperty(
      "touch-action",
      "auto",
      "important"
    );

    body.style.setProperty(
      "overflow-x",
      "hidden",
      "important"
    );

    body.style.setProperty(
      "overflow-y",
      "visible",
      "important"
    );

    body.style.setProperty(
      "overscroll-behavior-y",
      "none",
      "important"
    );

    body.style.setProperty(
      "touch-action",
      "auto",
      "important"
    );

    root.style.height = "auto";
    body.style.minHeight = "100%";
    body.style.overflow = "visible";

    return () => {
      root.style.backgroundColor =
        previousRootBackground;

      body.style.backgroundColor =
        previousBodyBackground;

      root.style.overscrollBehavior =
        previousRootOverscroll;

      body.style.overscrollBehavior =
        previousBodyOverscroll;

      root.style.overflowX =
        previousRootOverflowX;

      body.style.overflowX =
        previousBodyOverflowX;

      root.style.overflowY =
        previousRootOverflowY;

      body.style.overflowY =
        previousBodyOverflowY;

      root.style.touchAction =
        previousRootTouchAction;

      body.style.touchAction =
        previousBodyTouchAction;

      root.style.height =
        previousRootHeight;

      body.style.minHeight =
        previousBodyMinHeight;

      body.style.overflow =
        previousBodyOverflow;
    };
  }, []);

  /* =====================================================
      FETCH PROJECT
  ====================================================== */

  useEffect(() => {
    let cancelled = false;

    async function fetchProject() {
      try {
        setLoading(true);

        const data =
          await publicProjectApi.getProjectBySlug(slug);

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

  /* =====================================================
      LOADING
  ====================================================== */

  if (loading) {
    return (
      <main
        className="flex min-h-screen items-center justify-center bg-[#FFF7E8] px-6 text-[#0B1F3A]"
        style={{
          fontFamily: "'Manrope', sans-serif",
        }}
      >
        <p
          className="text-4xl"
          style={{
            fontFamily:
              "'Berkshire Swash', cursive",
          }}
        >
          Loading project...
        </p>
      </main>
    );
  }

  /* =====================================================
      ERROR
  ====================================================== */

  if (error || !project) {
    return (
      <main
        className="min-h-screen bg-[#FFF7E8] px-5 py-16 text-[#0B1F3A] sm:px-8"
        style={{
          fontFamily: "'Manrope', sans-serif",
        }}
      >
        <div className="mx-auto max-w-2xl rounded-4xl border border-[#D6C8AF] bg-[#F3E7D0] p-8 text-center shadow-[0_18px_50px_rgba(11,31,58,0.08)] sm:p-12">
          <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#274C77]">
            Project unavailable
          </p>

          <h1
            className="mt-4 text-4xl sm:text-5xl"
            style={{
              fontFamily:
                "'Berkshire Swash', cursive",
            }}
          >
            Project not found
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#5B6573]">
            {error || "This project may no longer be available."}
          </p>

          <Link
            href="/projects"
            className="mt-7 inline-flex rounded-full bg-[#274C77] px-6 py-3.5 text-[9px] font-bold uppercase tracking-[0.2em] text-[#F3E7D0] transition duration-300 hover:bg-[#0B1F3A]"
          >
            ← Back to Projects
          </Link>
        </div>
      </main>
    );
  }

  const hasBefore =
    Boolean(project.beforeImage?.url);

  const hasAfter =
    Boolean(project.afterImage?.url);

  /*
   * IMPORTANT:
   * beforeImage and afterImage are handled separately.
   *
   * project.images[] is the actual additional gallery.
   */

  const galleryImages =
    project.images ?? [];

  return (
    <main
      className="min-h-screen overflow-x-hidden bg-[#FFF7E8] text-[#0B1F3A]"
      style={{
        fontFamily: "'Manrope', sans-serif",
      }}
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="fixed inset-x-0 top-0 z-100 h-20 border-b border-[#F3E7D0]/15 bg-[#0B1F3A] text-[#F3E7D0] shadow-[0_8px_30px_rgba(11,31,58,0.12)]">
  <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between px-5 sm:px-8 lg:px-12">
    {/* LOGO */}
    <Link href="/" className="group">
      <p
        className="text-2xl leading-none tracking-[0.24em] sm:text-[28px]"
        style={{
          fontFamily: "'Berkshire Swash', cursive",
        }}
      >
        STUDIO
      </p>

      <p className="mt-2 text-[8px] uppercase tracking-[0.34em] text-[#DCC9AA]">
        Interior Design
      </p>
    </Link>

    {/* NAVIGATION */}
    <nav className="hidden items-center gap-7 lg:flex">
      <Link
        href="/"
        className="text-[10px] uppercase tracking-[0.2em] text-[#F3E7D0]/90 transition hover:text-white"
      >
        Home
      </Link>

      <Link
        href="/designs"
        className="text-[10px] uppercase tracking-[0.2em] text-[#F3E7D0]/90 transition hover:text-white"
      >
        Designs
      </Link>

      <Link
        href="/services"
        className="text-[10px] uppercase tracking-[0.2em] text-[#F3E7D0]/90 transition hover:text-white"
      >
        Services
      </Link>

      <Link
        href="/#portfolio"
        className="text-[10px] uppercase tracking-[0.2em] text-[#F3E7D0]/90 transition hover:text-white"
      >
        Projects
      </Link>

      <Link
        href="/#about"
        className="text-[10px] uppercase tracking-[0.2em] text-[#F3E7D0]/90 transition hover:text-white"
      >
        About
      </Link>

      <Link
        href="/#contact"
        className="text-[10px] uppercase tracking-[0.2em] text-[#F3E7D0]/90 transition hover:text-white"
      >
        Contact
      </Link>
    </nav>

    {/* CONSULTATION */}
    <Link
      href="/consultation"
      className="inline-flex items-center rounded-full bg-[#F3E7D0] px-5 py-3 text-[9px] font-bold uppercase tracking-[0.16em] text-[#0B1F3A] transition hover:bg-white"
    >
      Book a Consultation
      <span className="ml-2 text-sm leading-none">
        →
      </span>
    </Link>
  </div>
</header>

      {/* =====================================================
          PROJECT INTRO
      ====================================================== */}

      <section className="px-5 pb-10 pt-12 sm:px-8 sm:pb-14 sm:pt-16 lg:px-12 lg:pt-20">
        <div className="mx-auto max-w-375">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-[#CFC3B0] px-4 py-2 text-[8px] font-bold uppercase tracking-[0.22em] text-[#6F747C]">
              Project
            </span>

            {project.featured && (
              <span className="rounded-full bg-[#EBCB84] px-4 py-2 text-[8px] font-bold uppercase tracking-[0.2em] text-[#0B1F3A]">
                Featured
              </span>
            )}
          </div>

          <div className="mt-7 grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
            <div>
              <h1
                className="max-w-5xl text-[clamp(3.2rem,7vw,7.5rem)] font-normal leading-[0.82] tracking-[-0.04em]"
                style={{
                  fontFamily:
                    "'Berkshire Swash', cursive",
                }}
              >
                {project.title}
              </h1>
            </div>

            <div className="lg:pb-2">
              {project.location && (
                <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#6F747C]">
                  {project.location}
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-x-3 gap-y-2">
                {project.category && (
                  <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#274C77]">
                    {project.category}
                  </span>
                )}

                {project.category &&
                  project.style && (
                    <span className="text-[#C79B3B]">
                      |
                    </span>
                  )}

                {project.style && (
                  <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#274C77]">
                    {project.style}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          BEFORE / AFTER HERO
      ====================================================== */}

      <section className="px-5 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-375">
          <div className="relative grid grid-cols-1 overflow-hidden bg-[#E6D8B8] md:grid-cols-2">
            {/* CENTER DIVIDER */}
            <div className="pointer-events-none absolute inset-y-0 left-1/2 z-20 hidden w-px -translate-x-1/2 bg-[#FFF7E8]/90 md:block" />

            {/* BEFORE */}
            <div className="relative aspect-4/3 overflow-hidden md:aspect-[1.1/0.82]">
              {hasBefore ? (
                <Image
                  src={project.beforeImage!.url}
                  alt={
                    project.beforeImage!.alt ||
                    `${project.title} before transformation`
                  }
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-[9px] font-bold uppercase tracking-[0.2em] text-[#8A847A]">
                  No before image
                </div>
              )}

              <div className="absolute left-4 top-4 sm:left-6 sm:top-6">
                <span className="bg-[#FFF7E8]/92 px-4 py-2 text-[8px] font-bold uppercase tracking-[0.2em] text-[#0B1F3A] backdrop-blur-sm">
                  Before
                </span>
              </div>
            </div>

            {/* AFTER */}
            <div className="relative aspect-4/3 overflow-hidden md:aspect-[1.1/0.82]">
              {hasAfter ? (
                <Image
                  src={project.afterImage!.url}
                  alt={
                    project.afterImage!.alt ||
                    `${project.title} after transformation`
                  }
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-[9px] font-bold uppercase tracking-[0.2em] text-[#8A847A]">
                  No after image
                </div>
              )}

              <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
                <span className="bg-[#274C77]/92 px-4 py-2 text-[8px] font-bold uppercase tracking-[0.2em] text-[#F3E7D0] backdrop-blur-sm">
                  After
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          PROJECT STORY
      ====================================================== */}

      <section className="px-5 py-14 sm:px-8 sm:py-18 lg:px-12 lg:py-24">
        <div className="mx-auto grid max-w-312.5 gap-12 lg:grid-cols-[1.4fr_0.6fr] lg:gap-20">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#274C77]">
              The transformation
            </p>

            <h2
              className="mt-4 max-w-4xl text-[clamp(2.8rem,5vw,5.5rem)] font-normal leading-[0.88] tracking-tight"
              style={{
                fontFamily:
                  "'Berkshire Swash', cursive",
              }}
            >
              A space transformed with intention.
            </h2>

            <p className="mt-7 whitespace-pre-line text-sm leading-8 text-[#5B6573] sm:text-base">
              {project.description}
            </p>
          </div>

          {/* PROJECT DETAILS */}
          <aside className="self-start bg-[#F3E7D0] p-7 sm:p-8">
            <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#8A847A]">
              Project details
            </p>

            <div className="mt-6 divide-y divide-[#D6C8AF]">
              {project.location && (
                <DetailRow
                  label="Location"
                  value={project.location}
                />
              )}

              {project.category && (
                <DetailRow
                  label="Category"
                  value={project.category}
                />
              )}

              {project.style && (
                <DetailRow
                  label="Style"
                  value={project.style}
                />
              )}

              <DetailRow
                label="Status"
                value={
                  project.featured
                    ? "Featured project"
                    : "Completed project"
                }
              />
            </div>
          </aside>
        </div>
      </section>

      {/* =====================================================
          ADDITIONAL GALLERY
      ====================================================== */}

      {galleryImages.length > 0 && (
        <section className="bg-[#F3E7D0] px-5 py-14 sm:px-8 sm:py-18 lg:px-12 lg:py-24">
          <div className="mx-auto max-w-375">
            <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#274C77]">
                  Inside the space
                </p>

                <h2
                  className="mt-3 text-[clamp(2.8rem,5vw,5.5rem)] font-normal leading-[0.88]"
                  style={{
                    fontFamily:
                      "'Berkshire Swash', cursive",
                  }}
                >
                  The details.
                </h2>
              </div>

              <p className="max-w-sm text-sm leading-6 text-[#5B6573]">
                A closer look at the materials, details,
                furniture and finished spaces behind the
                transformation.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {galleryImages.map(
                (image, index) => (
                  <div
                    key={`${image.url}-${index}`}
                    className={`relative overflow-hidden bg-[#E6D8B8] ${
                      index === 0
                        ? "sm:col-span-2 lg:col-span-2"
                        : ""
                    }`}
                  >
                    <div
                      className={
                        index === 0
                          ? "relative aspect-16/10"
                          : "relative aspect-4/3"
                      }
                    >
                      <Image
                        src={image.url}
                        alt={
                          image.alt ||
                          `${project.title} project detail ${
                            index + 1
                          }`
                        }
                        fill
                        unoptimized
                        sizes={
                          index === 0
                            ? "(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 66vw"
                            : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        }
                        className="object-cover transition duration-700 ease-out hover:scale-[1.025]"
                      />
                    </div>

                    <div className="absolute bottom-4 left-4">
                      <span className="bg-[#FFF7E8]/90 px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.18em] text-[#0B1F3A] backdrop-blur-sm">
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          MATERIALS
      ====================================================== */}

      {project.materials?.length > 0 && (
        <section className="px-5 py-14 sm:px-8 sm:py-18 lg:px-12 lg:py-24">
          <div className="mx-auto grid max-w-312.5 gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#274C77]">
                Material language
              </p>

              <h2
                className="mt-3 text-[clamp(2.8rem,5vw,5rem)] font-normal leading-[0.88]"
                style={{
                  fontFamily:
                    "'Berkshire Swash', cursive",
                }}
              >
                Materials that shape the space.
              </h2>
            </div>

            <div className="flex flex-wrap gap-3 lg:pt-3">
              {project.materials.map(
                (material, index) => (
                  <span
                    key={`${material}-${index}`}
                    className="rounded-full border border-[#CFC3B0] bg-[#F3E7D0] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#0B1F3A]"
                  >
                    {material}
                  </span>
                )
              )}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          CONSULTATION CTA
      ====================================================== */}

      <section className="px-5 pb-12 pt-2 sm:px-8 sm:pb-16 lg:px-12 lg:pb-20">
        <div className="mx-auto max-w-375">
          <div className="relative overflow-hidden bg-[#0B1F3A] px-6 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
            {/* Decorative circles */}
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-[#F3E7D0]/10" />

            <div className="pointer-events-none absolute -bottom-28 -left-20 h-64 w-64 rounded-full border border-[#F3E7D0]/10" />

            <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#EBCB84]">
                  Inspired by this project?
                </p>

                <h2
                  className="mt-4 max-w-3xl text-[clamp(3rem,6vw,6.5rem)] font-normal leading-[0.84] tracking-[-0.03em] text-[#F3E7D0]"
                  style={{
                    fontFamily:
                      "'Berkshire Swash', cursive",
                  }}
                >
                  Let&apos;s create
                  <br />
                  <span className="text-[#AFC0CD]">
                    your space.
                  </span>
                </h2>

                <p className="mt-6 max-w-xl text-sm leading-7 text-[#F3E7D0]/65">
                  Tell us about your space, your ideas and
                  what you want it to become.
                </p>
              </div>

              <Link
                href="/consultation"
                className="group inline-flex w-fit items-center gap-5 rounded-full bg-[#274C77] px-7 py-4 text-[9px] font-bold uppercase tracking-[0.22em] text-[#F3E7D0] transition duration-300 hover:bg-[#0B1F3A] hover:ring-1 hover:ring-[#F3E7D0]/30"
              >
                <span>
                  Book Free Consultation
                </span>

                <span className="text-base leading-none transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ============================================================
   DETAIL ROW
============================================================ */

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-5 py-4">
      <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#8A847A]">
        {label}
      </span>

      <span className="text-right text-sm font-semibold capitalize text-[#0B1F3A]">
        {value}
      </span>
    </div>
  );
}