"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { publicDesignApi, type Design } from "@/lib/api";
import "@fontsource/berkshire-swash/400.css";

const ROOM_FILTERS = [
  { label: "All", value: "" },
  { label: "Living", value: "living-room" },
  { label: "Kitchen", value: "kitchen" },
  { label: "Bedroom", value: "bedroom" },
  { label: "Dining", value: "dining-room" },
  { label: "Bathroom", value: "bathroom" },
];

const STYLE_OPTIONS = [
  { label: "All styles", value: "" },
  { label: "Modern", value: "modern" },
  { label: "Minimalist", value: "minimalist" },
  { label: "Traditional", value: "traditional" },
  { label: "Indian", value: "indian" },
  { label: "Royal", value: "royal" },
  { label: "Aesthetic", value: "aesthetic" },
];

function formatLabel(value?: string) {
  if (!value) return "";
  return value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getImageUrl(design?: Design) {
  return design?.images?.[0]?.url || "";
}

function DesignImage({
  design,
  priority = false,
  sizes,
  className = "",
}: {
  design: Design;
  priority?: boolean;
  sizes: string;
  className?: string;
}) {
  const imageUrl = getImageUrl(design);

  if (!imageUrl) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#E8DDCB] text-xs uppercase tracking-[0.18em] text-[#6B675F]">
        No image available
      </div>
    );
  }

  return (
    <Image
      src={imageUrl}
      alt={
        design.images?.[0]?.alt ||
        design.title ||
        "Interior design project"
      }
      fill
      priority={priority}
      sizes={sizes}
      className={`object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035] ${className}`}
    />
  );
}

function Meta({
  design,
  light = false,
}: {
  design: Design;
  light?: boolean;
}) {
  return (
    <div
      className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-medium uppercase tracking-[0.18em] ${
        light ? "text-white/75" : "text-[#274C77]"
      }`}
    >
      <span>{formatLabel(design.roomType)}</span>
      {design.style && (
        <>
          <span className={light ? "text-white/40" : "text-[#B4A890]"}>·</span>
          <span>{formatLabel(design.style)}</span>
        </>
      )}
    </div>
  );
}

function ProjectCard({
  design,
  large = false,
  priority = false,
}: {
  design: Design;
  large?: boolean;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/designs/${design.slug}`}
      className="group block h-full focus:outline-none"
      aria-label={`View ${design.title || "design project"}`}
    >
      <article
        className={`relative h-full overflow-hidden bg-[#E8DDCB] ${
          large ? "min-h-97.5 sm:min-h-117.5 lg:min-h-125" : "min-h-117.5 sm:min-h-67.5"
        }`}
      >
        <DesignImage
          design={design}
          priority={priority}
          sizes={
            large
              ? "(max-width: 768px) 100vw, 62vw"
              : "(max-width: 768px) 100vw, 38vw"
          }
        />

        <div className="absolute inset-0 bg-linear-to-t from-[#07182D]/90 via-[#07182D]/15 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
          <Meta design={design} light />

          <h2
            style={{ fontFamily: "'Berkshire Swash'" }}
            className={`mt-3 max-w-2xl font-semibold leading-[0.98] ${
              large
                ? "text-4xl sm:text-5xl lg:text-6xl"
                : "text-3xl sm:text-4xl"
            }`}
          >
            {design.title}
          </h2>

          {large && design.description && (
            <p className="mt-4 max-w-xl text-sm leading-6 text-white/78 sm:text-[15px]">
              {design.description}
            </p>
          )}

          <span className="mt-5 inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-white transition-transform duration-300 group-hover:translate-x-1">
            View Project
            <span aria-hidden="true" className="text-base leading-none">
              →
            </span>
          </span>
        </div>
      </article>
    </Link>
  );
}

export default function DesignsPage() {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [roomType, setRoomType] = useState("");
  const [style, setStyle] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    const previousRootBackground = root.style.backgroundColor;
    const previousBodyBackground = body.style.backgroundColor;
    const previousRootOverscroll = root.style.overscrollBehavior;
    const previousBodyOverscroll = body.style.overscrollBehavior;
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

    // Keep the document itself as the only vertical scroll surface.
    // This prevents the touchpad from getting trapped by a nested/locked
    // scrolling container while still preventing horizontal page drift.
    root.style.setProperty("overflow-x", "hidden", "important");
    root.style.setProperty("overflow-y", "scroll", "important");
    root.style.setProperty("overscroll-behavior-y", "none", "important");
    root.style.setProperty("touch-action", "auto", "important");

    body.style.setProperty("overflow-x", "hidden", "important");
    body.style.setProperty("overflow-y", "visible", "important");
    body.style.setProperty("overscroll-behavior-y", "none", "important");
    body.style.setProperty("touch-action", "auto", "important");

    root.style.height = "auto";
    body.style.minHeight = "100%";
    body.style.overflow = "visible";

    return () => {
      root.style.backgroundColor = previousRootBackground;
      body.style.backgroundColor = previousBodyBackground;
      root.style.overscrollBehavior = previousRootOverscroll;
      body.style.overscrollBehavior = previousBodyOverscroll;
      root.style.overflowX = previousRootOverflowX;
      body.style.overflowX = previousBodyOverflowX;
      root.style.overflowY = previousRootOverflowY;
      body.style.overflowY = previousBodyOverflowY;
      root.style.touchAction = previousRootTouchAction;
      body.style.touchAction = previousBodyTouchAction;
      root.style.height = previousRootHeight;
      body.style.minHeight = previousBodyMinHeight;
      body.style.overflow = previousBodyOverflow;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchDesigns = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await publicDesignApi.getDesigns({
          search: search.trim() || undefined,
          roomType: roomType || undefined,
          style: style || undefined,
        });

        if (!cancelled) {
          setDesigns(result.items ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load designs."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchDesigns();

    return () => {
      cancelled = true;
    };
  }, [search, roomType, style, retryCount]);

  const handleRetry = () => {
    setLoading(true);
    setRetryCount((count) => count + 1);
  };

  const featured = designs[0];
  const sideProjects = designs.slice(1, 3);
  const lowerProjects = designs.slice(3, 5);
  const fullBleedProject = designs[5];

  return (
    <>
      {/* MAIN NAVBAR — fixed above every scrolling section */}
      <header className="fixed inset-x-0 top-0 z-100 border-b border-[#F3E7D0]/15 bg-[#0B1F3A] shadow-[0_8px_30px_rgba(11,31,58,0.12)]">
        <div className="mx-auto flex h-19 max-w-[1600px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <Link href="/" className="group shrink-0">
            <p style={{ fontFamily: "'Berkshire Swash'" }} className="text-2xl font-medium leading-none tracking-[0.24em] text-[#F3E7D0] sm:text-[28px]">STUDIO</p>
            <p className="mt-2 text-[8px] uppercase tracking-[0.34em] text-[#DCC9AA]">Interior Design</p>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            <Link href="/" className="text-[10px] uppercase tracking-[0.2em] text-[#F3E7D0]/90 hover:text-white">Home</Link>
            <Link href="/designs" className="text-[10px] uppercase tracking-[0.2em] text-white">Designs</Link>
            <Link href="/#services" className="text-[10px] uppercase tracking-[0.2em] text-[#F3E7D0]/90 hover:text-white">Services</Link>
            <Link href="/#portfolio" className="text-[10px] uppercase tracking-[0.2em] text-[#F3E7D0]/90 hover:text-white">Projects</Link>
            <Link href="/#about" className="text-[10px] uppercase tracking-[0.2em] text-[#F3E7D0]/90 hover:text-white">About</Link>
            <Link href="/#contact" className="text-[10px] uppercase tracking-[0.2em] text-[#F3E7D0]/90 hover:text-white">Contact</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="hidden text-[10px] uppercase tracking-[0.16em] text-[#F3E7D0] hover:text-white sm:block">Sign In</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="hidden rounded-full bg-[#F3E7D0] px-6 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#0B1F3A] transition hover:bg-white sm:block">
                  Book a Consultation <span className="ml-2 text-sm">→</span>
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <div className="hidden sm:block"><UserButton /></div>
            </Show>
            <button type="button" aria-label="Open navigation" onClick={() => setMobileMenuOpen(true)} className="flex h-10 w-10 items-center justify-center rounded-full border border-[#F3E7D0]/30 lg:hidden">
              <span className="space-y-1.5">
                <span className="block h-px w-5 bg-[#F3E7D0]" />
                <span className="block h-px w-5 bg-[#F3E7D0]" />
                <span className="block h-px w-5 bg-[#F3E7D0]" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile navigation */}
      <div className={`fixed inset-0 z-110 lg:hidden ${mobileMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"} transition-opacity duration-300`}>
        <div className="absolute inset-0 bg-[#0B1F3A]/50" onClick={() => setMobileMenuOpen(false)} />
        <div className={`absolute right-0 top-0 h-full w-[85%] max-w-sm bg-[#0B1F3A] p-7 text-[#F3E7D0] shadow-2xl transition-transform duration-500 ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex items-center justify-between">
            <div>
              <p style={{ fontFamily: "'Berkshire Swash'" }} className="text-xl tracking-[0.18em]">STUDIO<span className="text-[#DCC9AA]">.</span></p>
              <p className="mt-1 text-[8px] uppercase tracking-[0.25em] text-[#DCC9AA]">Interior Design</p>
            </div>
            <button type="button" onClick={() => setMobileMenuOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full border border-[#F3E7D0]/30 text-xl" aria-label="Close navigation">×</button>
          </div>
          <nav className="mt-16 flex flex-col gap-7">
            {[['Home','/'],['Designs','/designs'],['Services','/#services'],['Projects','/#portfolio'],['About','/#about'],['Contact','/#contact']].map(([label, href]) => (
              <Link key={label} href={href} onClick={() => setMobileMenuOpen(false)} style={{ fontFamily: "'Berkshire Swash'" }} className="text-3xl">{label}</Link>
            ))}
          </nav>
        </div>
      </div>

      <main className="min-h-screen w-full bg-[#FFF7E8] pt-19 text-[#0B1F3A]" style={{ fontFamily: "'Manrope'" }}>
      {/* =====================================================
          EDITORIAL HERO
      ====================================================== */}
      <section className="px-4 pb-2 pt-1 sm:px-8 sm:pb-3 lg:px-12 lg:pt-2">
        <div className="relative mx-auto max-w-[1600px] overflow-hidden bg-[#E7DAC4]">
          <div className="relative min-h-30 sm:min-h-33.75 lg:min-h-37.5">
            {/* Uses an existing gallery image when available, so the page
                stays connected to the real design data. */}
            {featured && getImageUrl(featured) ? (
              <Image
                src={getImageUrl(featured)}
                alt={featured.images?.[0]?.alt || featured.title || "Interior design"}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-[#E7DAC4]" />
            )}

            <div className="absolute inset-0 bg-linear-to-r from-[#FFF7E8]/95 via-[#FFF7E8]/72 to-transparent" />

            <div className="relative flex min-h-60 items-end px-6 pb-5 sm:min-h-67.5 sm:px-10 sm:pb-6 lg:min-h-75 lg:px-16 lg:pb-7">
              <div className="max-w-295">
                <h1 style={{ fontFamily: "'Berkshire Swash'" }} className="max-w-full text-[clamp(1.9rem,3.8vw,4.2rem)] font-semibold leading-[0.9] tracking-[-0.045em] lg:whitespace-nowrap">
                  Spaces that tell a story.
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-5.5 text-[#4E5560] sm:text-[15px] sm:leading-6">
                  Explore thoughtfully designed interiors where architecture,
                  material, and everyday life come together.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FILTER BAR
      ====================================================== */}
      <section className="sticky top-19 z-40 border-y border-[#D8CCBA] bg-[#FFF7E8]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-2 px-4 py-2.5 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12">
          <div className="flex min-w-0 gap-5 overflow-x-auto pb-0 lg:gap-7">
            {ROOM_FILTERS.map((filter) => {
              const active = roomType === filter.value;

              return (
                <button
                  key={filter.value || "all"}
                  type="button"
                  onClick={() => setRoomType(filter.value)}
                  className={`shrink-0 rounded-full border border-[#274C77] bg-[#274C77] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#FFF7E8] transition-all duration-200 hover:bg-[#0B1F3A] hover:text-[#FFF7E8] ${
                    active ? "ring-1 ring-[#274C77]/40" : ""
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          <div className="flex w-full items-center gap-4 lg:w-auto">
            <label className="relative flex min-w-0 flex-1 items-center border-b border-[#BDB4A4] lg:w-55">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="mr-3 h-4 w-4 shrink-0 text-[#5B6573]"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="6.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="m16 16 4.25 4.25"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search projects"
                className="w-full bg-transparent py-2 text-sm text-[#0B1F3A] outline-none placeholder:text-[#858177]"
              />
            </label>

            <select
              value={style}
              onChange={(event) => setStyle(event.target.value)}
              aria-label="Filter by design style"
              className="max-w-32.5 border-0 bg-transparent py-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#5B6573] outline-none"
            >
              {STYLE_OPTIONS.map((option) => (
                <option key={option.value || "all-styles"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* =====================================================
          GALLERY
      ====================================================== */}
      <section className="px-4 py-7 sm:px-8 sm:py-9 lg:px-12 lg:py-10">
        <div className="mx-auto max-w-[1600px]">
          {loading && (
            <div className="grid gap-5 md:grid-cols-[1.35fr_0.85fr]">
              <div className="min-h-130 animate-pulse bg-[#E9DFCF]" />
              <div className="grid gap-5">
                <div className="min-h-62.5 animate-pulse bg-[#E9DFCF]" />
                <div className="min-h-62.5 animate-pulse bg-[#E9DFCF]" />
              </div>
            </div>
          )}

          {!loading && error && (
            <div className="border border-[#D8CCBA] bg-[#F2E6CC] px-6 py-10 text-center">
              <p className="text-sm text-[#6A6257]">{error}</p>

              <button
                type="button"
                onClick={handleRetry}
                className="mt-5 border border-[#0B1F3A] bg-[#0B1F3A] px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#274C77]"
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !error && designs.length === 0 && (
            <div className="border border-[#D8CCBA] bg-[#F2E6CC] px-6 py-16 text-center">
              <h2 style={{ fontFamily: "'Berkshire Swash'" }} className="text-4xl font-semibold text-[#0B1F3A]">
                No designs found.
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#6A6257]">
                Try another search term or choose a different room or style.
              </p>
            </div>
          )}

          {!loading && !error && featured && (
            <>
              {/* Featured + two stacked projects */}
              <div className="grid gap-5 lg:grid-cols-[1.45fr_0.85fr]">
                <ProjectCard design={featured} large priority />

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
                  {sideProjects.map((design, index) => (
                    <ProjectCard
                      key={design._id}
                      design={design}
                      priority={index === 0}
                    />
                  ))}
                </div>
              </div>

              {/* Two-card editorial row */}
              {lowerProjects.length > 0 && (
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  {lowerProjects.map((design) => (
                    <ProjectCard key={design._id} design={design} />
                  ))}
                </div>
              )}

              {/* Full-bleed project */}
              {fullBleedProject && (
                <div className="mt-5">
                  <Link
                    href={`/designs/${fullBleedProject.slug}`}
                    className="group block focus:outline-none"
                    aria-label={`View ${fullBleedProject.title || "design project"}`}
                  >
                    <article className="relative min-h-90 overflow-hidden bg-[#DCCFB9] sm:min-h-110 lg:min-h-125">
                      <DesignImage
                        design={fullBleedProject}
                        sizes="100vw"
                      />

                      <div className="absolute inset-0 bg-linear-to-t from-[#07182D]/90 via-[#07182D]/20 to-transparent" />

                      <div className="absolute inset-x-0 bottom-0 p-7 text-white sm:p-10 lg:p-14">
                        <Meta design={fullBleedProject} light />

                        <h2 style={{ fontFamily: "'Berkshire Swash'" }} className="mt-4 max-w-4xl text-5xl font-normal leading-[0.92] tracking-tight sm:text-6xl lg:text-8xl">
                          {fullBleedProject.title}
                        </h2>

                        {fullBleedProject.description && (
                          <p className="mt-5 max-w-2xl text-sm leading-6 text-white/78 sm:text-base">
                            {fullBleedProject.description}
                          </p>
                        )}

                        <span className="mt-6 inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.22em] transition-transform duration-300 group-hover:translate-x-1">
                          View Project
                          <span aria-hidden="true" className="text-base">
                            →
                          </span>
                        </span>
                      </div>
                    </article>
                  </Link>
                </div>
              )}

              {/* More projects if API returns more than the editorial layout needs */}
              {designs.length > 6 && (
                <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {designs.slice(6).map((design) => (
                    <ProjectCard key={design._id} design={design} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* =====================================================
          CONSULTATION CTA
      ====================================================== */}
      <section className="relative overflow-hidden bg-[#0B1F3A] px-6 py-8 text-[#FFF7E8] sm:px-10 sm:py-9 lg:px-14 lg:py-10">
        <div className="mx-auto max-w-[1600px]">
          <div className="max-w-3xl">
            <h2 style={{ fontFamily: "'Berkshire Swash'" }} className="text-[2.7rem] font-normal leading-none tracking-tight whitespace-nowrap sm:text-5xl lg:text-6xl">
              Your space could tell a story too.
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-5 text-white/65 sm:text-[14px]">
              Bring us your ideas, your lifestyle, or simply a room that does
              not feel right yet. We will help shape the direction.
            </p>

            <Link
              href="/consultation"
              className="mt-4 inline-flex items-center gap-5 rounded-full border border-white/25 bg-[#FFF7E8] px-7 py-3.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0B1F3A] transition hover:bg-white"
            >
              Book a Consultation
              <span className="text-base leading-none">→</span>
            </Link>
          </div>
        </div>

        <div
               className="pointer-events-none absolute -bottom-28 right-20 h-72 w-72 rounded-full border border-[#D8C8AB]/20"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-16 right-16 h-44 w-44 rounded-full border border-[#D8C8AB]/15"
        />
      </section>
    </main>
    </>
  );
}       