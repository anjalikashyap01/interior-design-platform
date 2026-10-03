"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { publicDesignApi, type Design } from "@/lib/api";
import "@fontsource/berkshire-swash/400.css";

export default function DesignDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [design, setDesign] = useState<Design | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  /*
   * ============================================================
   * DOCUMENT SCROLL
   *
   * Same scroll behavior as the Services Detail page.
   *
   * The browser/document handles the main page scroll.
   * The existing right information panel keeps its own
   * independent overflow-y-auto scroll.
   * ============================================================
   */
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

  useEffect(() => {
    let cancelled = false;

    async function fetchDesign() {
      try {
        const result =
          await publicDesignApi.getDesignBySlug(slug);

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

    if (slug) void fetchDesign();

    return () => {
      cancelled = true;
    };
  }, [slug, retryCount]);

  const handleRetry = () => {
    setError("");
    setLoading(true);
    setRetryCount((count) => count + 1);
  };

  // KEEPING THE SAME FONTS FROM YOUR FILE — NO FONT CHANGE.
  const displayFont = {
    fontFamily: "'Berkshire Swash', cursive",
  };

  const bodyFont = {
    fontFamily: "'Manrope', sans-serif",
  };

  if (loading) {
    return (
      <main
        className="flex min-h-screen items-center justify-center bg-[#FFF7E8] text-[#0B1F3A]"
        style={bodyFont}
      >
        <p
          className="text-3xl"
          style={displayFont}
        >
          Loading design...
        </p>
      </main>
    );
  }

  if (!slug || error || !design) {
    return (
      <main
        className="min-h-screen bg-[#FFF7E8] px-5 py-16 text-[#0B1F3A] sm:px-8"
        style={bodyFont}
      >
        <div className="mx-auto max-w-2xl rounded-4xl border border-[#D6C8AF] bg-[#F3E7D0] p-8 text-center shadow-[0_18px_50px_rgba(11,31,58,0.08)] sm:p-12">
          <h1
            className="text-4xl"
            style={displayFont}
          >
            Design not found
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-[#5B6573]">
            {!slug
              ? "Design slug is missing."
              : error ||
                "This design may no longer be available."}
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/designs"
              className="rounded-full bg-[#0B1F3A] px-6 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#FFF7E8] transition hover:bg-[#274C77]"
            >
              Back to Designs
            </Link>

            {slug && (
              <button
                type="button"
                onClick={handleRetry}
                className="rounded-full border border-[#BFAF92] px-6 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#0B1F3A] transition hover:bg-[#F3E7D0]"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </main>
    );
  }

  // Only the first image is used. There is intentionally no photo gallery.
  const heroImage = design.images?.[0] ?? null;

  return (
    <main
      className="min-h-screen w-full bg-[#FFF7E8] text-[#0B1F3A]"
      style={bodyFont}
    >
      {/* =====================================================
          FIXED NAVBAR
      ====================================================== */}
      <header className="fixed inset-x-0 top-0 z-100 h-20 border-b border-[#F3E7D0]/15 bg-[#0B1F3A] text-[#F3E7D0] shadow-[0_8px_30px_rgba(11,31,58,0.12)]">
        <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <Link
            href="/"
            className="group"
          >
            <p
              className="text-2xl leading-none tracking-[0.24em] sm:text-[28px]"
              style={displayFont}
            >
              STUDIO
            </p>

            <p className="mt-2 text-[8px] uppercase tracking-[0.34em] text-[#DCC9AA]">
              Interior Design
            </p>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {[
              ["Home", "/"],
              ["Designs", "/designs"],
              ["Services", "/services"],
              ["Projects", "/#portfolio"],
              ["About", "/#about"],
              ["Contact", "/#contact"],
            ].map(([label, href]) => (
              <Link
                key={label}
                href={href}
                className="text-[10px] uppercase tracking-[0.2em] text-[#F3E7D0]/90 transition hover:text-white"
              >
                {label}
              </Link>
            ))}
          </nav>

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
          DESIGN EXPERIENCE

          Full page/document scrolling is enabled.
          The right information panel below retains its
          existing independent scrolling.
      ====================================================== */}
      <div className="mx-auto flex h-screen max-w-[1800px] flex-col px-3 pt-20 sm:px-5 lg:px-8">
        {/* Back link */}
        <div className="flex h-14 shrink-0 items-center">
          <Link
            href="/designs"
            className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#5B6573] transition hover:text-[#0B1F3A]"
          >
            <span className="text-base">←</span>
            Back to Designs
          </Link>
        </div>

        <div className="min-h-0 flex-1 pb-3 lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)] lg:gap-5">
          {/* =================================================
              LEFT PROJECT IMAGE
          ================================================== */}
          <div className="relative hidden min-h-0 overflow-hidden rounded-4xl border border-[#D6C8AF] bg-[#E6D8B8] lg:block">
            {heroImage ? (
              <Image
                src={heroImage.url}
                alt={
                  heroImage.alt ||
                  design.title
                }
                fill
                priority
                sizes="60vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7A7F86]">
                No image available
              </div>
            )}

            <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-[#0B1F3A]/65 via-[#0B1F3A]/10 to-transparent" />

            <div className="absolute bottom-5 left-5 rounded-full bg-[#FFF7E8]/92 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.18em] text-[#0B1F3A] backdrop-blur-sm">
              Project Showcase
            </div>
          </div>

          {/* =================================================
              MOBILE IMAGE
          ================================================== */}
          <div className="relative mb-5 h-[48vh] min-h-70 overflow-hidden rounded-4xl border border-[#D6C8AF] bg-[#E6D8B8] lg:hidden">
            {heroImage ? (
              <Image
                src={heroImage.url}
                alt={
                  heroImage.alt ||
                  design.title
                }
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7A7F86]">
                No image available
              </div>
            )}

            <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-[#0B1F3A]/60 to-transparent" />

            <div className="absolute bottom-5 left-5 rounded-full bg-[#FFF7E8]/92 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.18em] text-[#0B1F3A]">
              Project Showcase
            </div>
          </div>

          {/* =================================================
              RIGHT INFORMATION PANEL

              DO NOT REMOVE overflow-y-auto.
              This remains independently scrollable.
          ================================================== */}
          <div className="min-h-0 overflow-y-auto overscroll-contain pr-1 lg:scrollbar-thin">
            <div className="space-y-5 pb-5">
              {/* PROJECT INTRO */}
              <section className="rounded-4xl border border-[#D6C8AF] bg-[#F3E7D0] p-7 sm:p-9">
                <div className="flex flex-wrap gap-2">
                  {design.roomType && (
                    <span className="rounded-full bg-[#FFF7E8] px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#5B6573]">
                      {design.roomType}
                    </span>
                  )}

                  {design.style && (
                    <span className="rounded-full bg-[#FFF7E8] px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#5B6573]">
                      {design.style}
                    </span>
                  )}

                  {design.featured && (
                    <span className="rounded-full bg-[#E8C77A] px-4 py-2 text-[9px] font-bold uppercase tracking-[0.15em] text-[#0B1F3A]">
                      Featured
                    </span>
                  )}
                </div>

                <div className="mt-6 h-px w-12 bg-[#C79B3B]" />

                <h1
                  className="mt-5 text-[clamp(2.8rem,5vw,5.8rem)] font-normal leading-[0.9] tracking-[-0.035em]"
                  style={displayFont}
                >
                  {design.title}
                </h1>

                <p className="mt-6 text-sm leading-7 text-[#5B6573] sm:text-base">
                  {design.description}
                </p>

                {/* QUICK FACTS */}
                <div className="mt-7 grid grid-cols-2 overflow-hidden rounded-4xl border border-[#D6C8AF] bg-[#FFF7E8] sm:grid-cols-3">
                  <div className="border-b border-[#D6C8AF] p-4 sm:border-b-0 sm:border-r">
                    <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#8A847A]">
                      Room Type
                    </p>

                    <p className="mt-2 text-sm font-semibold">
                      {design.roomType || "—"}
                    </p>
                  </div>

                  <div className="border-b border-[#D6C8AF] p-4 sm:border-b-0 sm:border-r">
                    <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#8A847A]">
                      Style
                    </p>

                    <p className="mt-2 text-sm font-semibold">
                      {design.style || "—"}
                    </p>
                  </div>

                  <div className="col-span-2 p-4 sm:col-span-1">
                    <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#8A847A]">
                      Project
                    </p>

                    <p className="mt-2 text-sm font-semibold">
                      {design.featured
                        ? "Featured"
                        : "Design"}
                    </p>
                  </div>
                </div>
              </section>

              {/* BUDGET */}
              {(design.budgetMin !== undefined ||
                design.budgetMax !== undefined) && (
                <section className="rounded-4xl bg-[#0B1F3A] p-7 text-[#FFF7E8] sm:p-8">
                  <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#DCC9AA]">
                    Project investment
                  </p>

                  <h2
                    className="mt-2 text-3xl sm:text-4xl"
                    style={displayFont}
                  >
                    Estimated Budget
                  </h2>

                  <p className="mt-3 text-xl font-semibold tracking-tight sm:text-2xl">
                    {design.budgetMin !==
                    undefined
                      ? `₹${design.budgetMin.toLocaleString(
                          "en-IN"
                        )}`
                      : "—"}
                    {" – "}
                    {design.budgetMax !==
                    undefined
                      ? `₹${design.budgetMax.toLocaleString(
                          "en-IN"
                        )}`
                      : "—"}
                  </p>
                </section>
              )}

              {/* DESIGN STORY */}
              <section className="rounded-4xl border border-[#D6C8AF] bg-[#F3E7D0] p-7 sm:p-8">
                <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#8A847A]">
                  The design
                </p>

                <h2
                  className="mt-3 text-[clamp(2.5rem,4vw,4rem)] font-normal leading-[0.92]"
                  style={displayFont}
                >
                  Designed around the way you live.
                </h2>

                <p className="mt-5 whitespace-pre-line text-sm leading-7 text-[#5B6573] sm:text-base">
                  {design.description}
                </p>
              </section>

              {/* COLORS */}
              {design.colors &&
                design.colors.length > 0 && (
                  <section className="rounded-4xl border border-[#D6C8AF] bg-white/45 p-7 sm:p-8">
                    <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#8A847A]">
                      Palette
                    </p>

                    <h2
                      className="mt-2 text-3xl"
                      style={displayFont}
                    >
                      Color Preferences
                    </h2>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {design.colors.map(
                        (color) => (
                          <span
                            key={color}
                            className="rounded-full border border-[#D6C8AF] bg-[#F3E7D0] px-5 py-3 text-sm font-medium text-[#0B1F3A]"
                          >
                            {color}
                          </span>
                        )
                      )}
                    </div>
                  </section>
                )}

              {/* MATERIALS */}
              {design.materials &&
                design.materials.length > 0 && (
                  <section className="rounded-4xl border border-[#D6C8AF] bg-white/45 p-7 sm:p-8">
                    <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#8A847A]">
                      Material language
                    </p>

                    <h2
                      className="mt-2 text-3xl"
                      style={displayFont}
                    >
                      Materials
                    </h2>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {design.materials.map(
                        (material) => (
                          <span
                            key={material}
                            className="rounded-3xl border border-[#D6C8AF] bg-[#F3E7D0] px-5 py-3 text-sm font-medium text-[#0B1F3A]"
                          >
                            {material}
                          </span>
                        )
                      )}
                    </div>
                  </section>
                )}

              {/* TAGS */}
              {design.tags &&
                design.tags.length > 0 && (
                  <section className="rounded-4xl border border-[#D6C8AF] bg-[#F3E7D0] p-7 sm:p-8">
                    <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#8A847A]">
                      Project identity
                    </p>

                    <h2
                      className="mt-2 text-3xl"
                      style={displayFont}
                    >
                      Tags
                    </h2>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {design.tags.map(
                        (tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-[#FFF7E8] px-4 py-2 text-[10px] font-semibold text-[#5B6573]"
                          >
                            #{tag}
                          </span>
                        )
                      )}
                    </div>
                  </section>
                )}

              {/* CTA */}
              <section className="rounded-4xl bg-[#0B1F3A] px-7 py-9 text-[#FFF7E8] sm:px-8">
                <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-[#DCC9AA]">
                  Inspired by this design?
                </p>

                <h2
                  className="mt-3 text-4xl leading-[0.95] sm:text-5xl"
                  style={displayFont}
                >
                  Create a space with the same attention to detail.
                </h2>

                <p className="mt-4 text-sm leading-6 text-[#DCC9AA]">
                  Explore more projects or speak with our
                  design team about your own space.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/designs"
                    className="rounded-full border border-[#F3E7D0]/30 px-6 py-3 text-[9px] font-bold uppercase tracking-[0.18em] text-[#F3E7D0] transition hover:bg-[#F3E7D0]/10"
                  >
                    More Designs
                  </Link>

                  <Link
                    href="/consultation"
                    className="rounded-full bg-[#F3E7D0] px-6 py-3 text-[9px] font-bold uppercase tracking-[0.18em] text-[#0B1F3A] transition hover:bg-white"
                  >
                    Book a Consultation →
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}