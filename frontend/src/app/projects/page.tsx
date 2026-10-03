"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  publicProjectApi,
  type Project,
} from "@/lib/api";

import "@fontsource/berkshire-swash/400.css";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";

const PROJECT_BACKGROUNDS = [
  "#FFF7E8",
  "#F3E7D0",
  "#F8F0E2",
  "#EEE4D2",
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  /* =====================================================
      SAME SCROLL BEHAVIOR AS DESIGNS PAGE
  ====================================================== */

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    const previousRootBackground = root.style.backgroundColor;
    const previousBodyBackground = body.style.backgroundColor;

    const previousRootOverscroll =
      root.style.overscrollBehavior;

    const previousBodyOverscroll =
      body.style.overscrollBehavior;

    const previousRootOverflowX = root.style.overflowX;
    const previousBodyOverflowX = body.style.overflowX;

    const previousRootOverflowY = root.style.overflowY;
    const previousBodyOverflowY = body.style.overflowY;

    const previousRootTouchAction = root.style.touchAction;
    const previousBodyTouchAction = body.style.touchAction;

    const previousRootHeight = root.style.height;
    const previousBodyMinHeight = body.style.minHeight;
    const previousBodyOverflow = body.style.overflow;

    root.style.backgroundColor = "#FFF7E8";
    body.style.backgroundColor = "#FFF7E8";

    /*
     * Keep the document itself as the only vertical
     * scrolling surface.
     *
     * This prevents touchpad scrolling from getting
     * trapped inside nested containers.
     *
     * Horizontal page drift is also disabled.
     */

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
      root.style.backgroundColor = previousRootBackground;
      body.style.backgroundColor = previousBodyBackground;

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

      root.style.height = previousRootHeight;
      body.style.minHeight = previousBodyMinHeight;
      body.style.overflow = previousBodyOverflow;
    };
  }, []);

  /* =====================================================
      FETCH PROJECTS
  ====================================================== */

  useEffect(() => {
    let cancelled = false;

    async function fetchProjects() {
      try {
        setLoading(true);

        const result =
          await publicProjectApi.getProjects();

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

  function handleRetry() {
    setError("");
    setLoading(true);
    setRetryCount((count) => count + 1);
  }

  /*
   * Use the project's AFTER image as the hero background.
   * If it doesn't exist, fall back to the first gallery image.
   */

  const heroImage =
    projects[0]?.afterImage?.url ||
    projects[0]?.images?.[0]?.url ||
    "";

  return (
    <main
      className="min-h-screen bg-[#FFF7E8] text-[#0B1F3A]"
      style={{
        fontFamily: "'Manrope', sans-serif",
      }}
    >
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
        className="text-[10px] uppercase tracking-[0.2em] text-white"
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
          COMPACT HERO
      ====================================================== */}

      <section className="relative overflow-hidden bg-[#F3E7D0] px-5 pb-10 pt-20 sm:px-8 sm:pb-12 sm:pt-24 lg:px-12 lg:pb-14 lg:pt-28">
        {/* =================================================
            BACKGROUND IMAGE
        ================================================== */}

        {heroImage && (
          <Image
            src={heroImage}
            alt=""
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover"
          />
        )}

        {/* =================================================
            LIGHTER IMAGE OVERLAY

            Previous:
            bg-[#F3E7D0]/88

            Now:
            bg-[#F3E7D0]/55

            This lets significantly more of the interior
            image remain visible.
        ================================================== */}

        <div className="absolute inset-0 bg-[#F3E7D0]/55" />

        {/* Soft readable gradient */}
        <div className="absolute inset-0 bg-linear-to-r from-[#F3E7D0]/72 via-[#F3E7D0]/48 to-[#FFF7E8]/25" />

        {/* =================================================
            DECORATIVE CIRCLES
        ================================================== */}

        <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full border border-[#274C77]/10" />

        <div className="pointer-events-none absolute -bottom-28 -left-20 h-64 w-64 rounded-full border border-[#274C77]/8" />

        {/* =================================================
            HERO CONTENT
        ================================================== */}

        <div className="relative mx-auto max-w-375">
          <h1
            className="max-w-5xl text-[clamp(3rem,7vw,6.5rem)] font-normal leading-[0.82] tracking-[-0.035em] text-[#0B1F3A]"
            style={{
              fontFamily: "'Berkshire Swash', cursive",
            }}
          >
            Spaces transformed
            <br />
            <span className="text-[#6F8799]">
              with intention.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-sm leading-6 text-[#4F5965] sm:mt-7 sm:text-[14px]">
            Explore the spaces we have transformed — from the
            original character of a room to the finished interior.
          </p>
        </div>
      </section>

      {/* =====================================================
          LOADING
      ====================================================== */}

      {loading && (
        <section className="bg-[#FFF7E8] px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
          <div className="mx-auto max-w-375">
            <div className="space-y-16 lg:space-y-20">
              <ProjectSkeleton />
              <ProjectSkeleton />
              <ProjectSkeleton />
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          ERROR
      ====================================================== */}

      {!loading && error && (
        <section className="bg-[#F3E7D0] px-5 py-14 sm:px-8 sm:py-18 lg:px-12 lg:py-20">
          <div className="mx-auto max-w-375">
            <div className="px-6 py-14 text-center sm:px-10">
              <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#274C77]">
                Something went wrong
              </p>

              <h2
                className="mt-4 text-4xl font-normal text-[#0B1F3A] sm:text-5xl"
                style={{
                  fontFamily:
                    "'Berkshire Swash', cursive",
                }}
              >
                We couldn&apos;t load the projects.
              </h2>

              <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-[#5B6573]">
                {error}
              </p>

              <button
                type="button"
                onClick={handleRetry}
                className="mt-7 rounded-full bg-[#274C77] px-7 py-3.5 text-[9px] font-bold uppercase tracking-[0.22em] text-[#F3E7D0] transition duration-300 hover:bg-[#0B1F3A]"
              >
                Try Again
              </button>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          EMPTY
      ====================================================== */}

      {!loading &&
        !error &&
        projects.length === 0 && (
          <section className="bg-[#F3E7D0] px-5 py-20 sm:px-8 lg:px-12">
            <div className="mx-auto max-w-375">
              <div className="px-6 text-center">
                <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#274C77]">
                  Our Portfolio
                </p>

                <h2
                  className="mt-4 text-4xl font-normal text-[#0B1F3A] sm:text-5xl"
                  style={{
                    fontFamily:
                      "'Berkshire Swash', cursive",
                  }}
                >
                  Projects are coming soon.
                </h2>

                <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#5B6573]">
                  Completed projects will appear here once
                  they are added by the studio.
                </p>
              </div>
            </div>
          </section>
        )}

      {/* =====================================================
          PROJECTS
      ====================================================== */}

      {!loading &&
        !error &&
        projects.length > 0 && (
          <>
            <section className="bg-[#FFF7E8]">
              <div className="mx-auto max-w-375">
                <div>
                  {projects.map((project, index) => (
                    <div
                      key={project._id}
                      className="px-5 py-14 sm:px-8 sm:py-18 lg:px-12 lg:py-20"
                      style={{
                        backgroundColor:
                          PROJECT_BACKGROUNDS[
                            index %
                              PROJECT_BACKGROUNDS.length
                          ],
                      }}
                    >
                      <ProjectCard
                        project={project}
                        index={index}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* =================================================
                CONSULTATION CTA
            ================================================== */}

            <ConsultationCTA />
          </>
        )}
    </main>
  );
}

/* ============================================================
   PROJECT CARD
============================================================ */

function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const hasBefore = Boolean(
    project.beforeImage?.url
  );

  const hasAfter = Boolean(
    project.afterImage?.url
  );

  return (
    <article className="mx-auto max-w-350">
      <Link
        href={`/projects/${project.slug}`}
        className="group block"
      >
        {/* =================================================
            NUMBER / FEATURED
        ================================================== */}

        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#CFC3B0] text-[9px] font-semibold tracking-[0.12em] text-[#6F747C] transition duration-300 group-hover:border-[#274C77] group-hover:text-[#274C77]">
              {String(index + 1).padStart(2, "0")}
            </span>

            <span className="text-[8px] font-semibold uppercase tracking-[0.24em] text-[#8A847A]">
              Transformation
            </span>
          </div>

          {project.featured && (
            <span className="rounded-full bg-[#EBCB84] px-4 py-2 text-[8px] font-bold uppercase tracking-[0.2em] text-[#0B1F3A]">
              Featured
            </span>
          )}
        </div>

        {/* =================================================
            BEFORE / AFTER
        ================================================== */}

        <div className="relative grid grid-cols-2 overflow-hidden bg-[#E6D8B8]">
          {/* Center divider */}
          <div className="pointer-events-none absolute inset-y-0 left-1/2 z-10 w-px -translate-x-1/2 bg-[#FFF7E8]/80" />

          {/* BEFORE */}
          <div className="relative aspect-4/3 overflow-hidden">
            {hasBefore ? (
              <Image
                src={project.beforeImage!.url}
                alt={
                  project.beforeImage!.alt ||
                  `${project.title} before transformation`
                }
                fill
                unoptimized
                sizes="(max-width: 768px) 50vw, 50vw"
                className="object-cover transition duration-700 ease-out group-hover:scale-[1.025]"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-center text-[9px] font-semibold uppercase tracking-[0.2em] text-[#8A847A]">
                No before image
              </div>
            )}

            <div className="absolute left-3 top-3 sm:left-5 sm:top-5">
              <span className="bg-[#FFF7E8]/90 px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.2em] text-[#0B1F3A] backdrop-blur-sm">
                Before
              </span>
            </div>
          </div>

          {/* AFTER */}
          <div className="relative aspect-4/3 overflow-hidden">
            {hasAfter ? (
              <Image
                src={project.afterImage!.url}
                alt={
                  project.afterImage!.alt ||
                  `${project.title} after transformation`
                }
                fill
                unoptimized
                sizes="(max-width: 768px) 50vw, 50vw"
                className="object-cover transition duration-700 ease-out group-hover:scale-[1.025]"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-center text-[9px] font-semibold uppercase tracking-[0.2em] text-[#8A847A]">
                No after image
              </div>
            )}

            <div className="absolute right-3 top-3 sm:right-5 sm:top-5">
              <span className="bg-[#274C77]/90 px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.2em] text-[#F3E7D0] backdrop-blur-sm">
                After
              </span>
            </div>
          </div>
        </div>

        {/* =================================================
            PROJECT INFORMATION
        ================================================== */}

        <div className="pt-6">
          {/* META */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[#6F747C]">
            {project.location && (
              <span className="text-[9px] font-semibold uppercase tracking-[0.18em]">
                {project.location}
              </span>
            )}

            {project.location &&
              project.category && (
                <span className="text-[#C79B3B]">
                  |
                </span>
              )}

            {project.category && (
              <span className="text-[9px] font-semibold uppercase tracking-[0.18em]">
                {project.category}
              </span>
            )}

            {project.style && (
              <>
                <span className="text-[#C79B3B]">
                  |
                </span>

                <span className="text-[9px] font-semibold uppercase tracking-[0.18em]">
                  {project.style}
                </span>
              </>
            )}
          </div>

          {/* TITLE */}
          <h2
            className="mt-3 max-w-4xl text-[clamp(2.2rem,4vw,4.5rem)] font-normal leading-[0.9] tracking-[-0.02em] text-[#0B1F3A]"
            style={{
              fontFamily:
                "'Berkshire Swash', cursive",
            }}
          >
            {project.title}
          </h2>

          {/* DESCRIPTION */}
          {project.description && (
            <p className="mt-5 max-w-2xl text-sm leading-7 text-[#5B6573]">
              {project.description}
            </p>
          )}

          {/* VIEW PROJECT */}
          <div className="mt-6 inline-flex items-center gap-4">
            <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#274C77] transition-colors group-hover:text-[#0B1F3A]">
              View Project
            </span>

            <span className="text-base leading-none text-[#274C77] transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

/* ============================================================
   CONSULTATION CTA
============================================================ */

function ConsultationCTA() {
  return (
    <section className="bg-[#FFF7E8] px-5 pb-12 pt-3 sm:px-8 sm:pb-16 lg:px-12 lg:pb-20">
      <div className="mx-auto max-w-375">
        <div className="relative overflow-hidden bg-[#0B1F3A] px-6 py-11 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
          {/* Decorative circles */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full border border-[#F3E7D0]/10" />

          <div className="pointer-events-none absolute -bottom-28 -left-20 h-56 w-56 rounded-full border border-[#F3E7D0]/10" />

          <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#EBCB84]">
                Start your transformation
              </p>

              <h2
                className="mt-4 max-w-2xl text-[clamp(2.6rem,5vw,5rem)] font-normal leading-[0.88] tracking-[-0.02em] text-[#F3E7D0]"
                style={{
                  fontFamily:
                    "'Berkshire Swash', cursive",
                }}
              >
                Your space could be
                <br />
                <span className="text-[#AFC0CD]">
                  next.
                </span>
              </h2>

              <p className="mt-5 max-w-lg text-sm leading-7 text-[#F3E7D0]/65">
                Tell us what you have in mind. We&apos;ll
                talk through your space, your ideas, and
                what it could become.
              </p>
            </div>

            <div className="flex flex-col items-start gap-5 lg:items-end">
              {/* Doodle route */}
              <div className="relative hidden h-14 w-44 sm:block">
                <svg
                  viewBox="0 0 180 55"
                  className="h-full w-full overflow-visible"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M5 42 C42 8, 75 8, 108 29 C124 39, 142 39, 165 16"
                    stroke="#F3E7D0"
                    strokeWidth="1.2"
                    strokeDasharray="3 5"
                    opacity="0.55"
                  />

                  <path
                    d="M157 10 L168 15 L158 21"
                    stroke="#EBCB84"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M105 24 L115 28 L106 34"
                    stroke="#EBCB84"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <span className="absolute right-0 top-0 text-[7px] uppercase tracking-[0.2em] text-[#F3E7D0]/45">
                  let&apos;s begin
                </span>
              </div>

              {/* BLUE / BEIGE CTA */}
              <Link
                href="/consultation"
                className="group inline-flex items-center gap-5 rounded-full bg-[#274C77] px-6 py-4 text-[9px] font-bold uppercase tracking-[0.22em] text-[#F3E7D0] transition duration-300 hover:bg-[#0B1F3A]"
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
      </div>
    </section>
  );
}

/* ============================================================
   LOADING SKELETON
============================================================ */

function ProjectSkeleton() {
  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 animate-pulse rounded-full bg-[#E6D8B8]" />

          <div className="h-2 w-24 animate-pulse bg-[#E6D8B8]" />
        </div>

        <div className="h-6 w-20 animate-pulse rounded-full bg-[#E6D8B8]" />
      </div>

      <div className="grid grid-cols-2 overflow-hidden">
        <div className="aspect-4/3 animate-pulse bg-[#E6D8B8]" />
        <div className="aspect-4/3 animate-pulse bg-[#E6D8B8]" />
      </div>

      <div className="pt-6">
        <div className="h-2 w-56 animate-pulse bg-[#E6D8B8]" />

        <div className="mt-4 h-10 w-2/3 animate-pulse bg-[#E6D8B8]" />

        <div className="mt-5 h-3 w-full animate-pulse bg-[#E6D8B8]" />

        <div className="mt-2 h-3 w-4/5 animate-pulse bg-[#E6D8B8]" />
      </div>
    </div>
  );
}