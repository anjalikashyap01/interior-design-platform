"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  publicServiceApi,
  type Service,
} from "@/lib/api";
import "@fontsource/berkshire-swash/400.css";

export default function ServiceDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
   * ============================================================
   * DOCUMENT SCROLL
   *
   * Keeps the page itself as the main browser scroll surface.
   * The right-side service information panel below keeps its
   * existing independent scroll behavior.
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

    async function fetchService() {
      try {
        const data =
          await publicServiceApi.getServiceBySlug(
            slug
          );

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

  // Same typography system as the Design detail page.
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
          Loading service...
        </p>
      </main>
    );
  }

  if (error || !service) {
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
            Service not found
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-[#5B6573]">
            {error ||
              "This service may no longer be available."}
          </p>

          <Link
            href="/services"
            className="mt-7 inline-flex rounded-full bg-[#0B1F3A] px-6 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#FFF7E8] transition hover:bg-[#274C77]"
          >
            Back to Services
          </Link>
        </div>
      </main>
    );
  }

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
          SERVICE EXPERIENCE

          IMPORTANT:
          - Full document/page uses normal browser scrolling.
          - Left image remains unchanged.
          - Right information panel keeps its own scroll.
      ====================================================== */}

      <div className="mx-auto flex h-screen max-w-[1800px] flex-col px-3 pt-20 sm:px-5 lg:px-8">
        {/* Back link */}

        <div className="flex h-14 shrink-0 items-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#5B6573] transition hover:text-[#0B1F3A]"
          >
            <span className="text-base">
              ←
            </span>
            Back to Services
          </Link>
        </div>

        <div className="min-h-0 flex-1 pb-3 lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)] lg:gap-5">
          {/* =================================================
              LEFT SERVICE IMAGE
          ================================================== */}

          <div className="relative hidden min-h-0 overflow-hidden rounded-4xl border border-[#D6C8AF] bg-[#E6D8B8] lg:block">
            {service.image ? (
              <Image
                src={service.image}
                alt={service.name}
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

            <div className="absolute inset-x-0 bottom-0 h-44 bg-linear-to-t from-[#0B1F3A]/70 via-[#0B1F3A]/15 to-transparent" />

            <div className="absolute bottom-5 left-5 rounded-full bg-[#FFF7E8]/92 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.18em] text-[#0B1F3A] backdrop-blur-sm">
              Interior Service
            </div>

            {service.featured && (
              <div className="absolute right-5 top-5 rounded-full bg-[#E8C77A] px-4 py-2 text-[9px] font-bold uppercase tracking-[0.18em] text-[#0B1F3A] shadow-sm">
                Featured Service
              </div>
            )}
          </div>

          {/* =================================================
              MOBILE SERVICE IMAGE
          ================================================== */}

          <div className="relative mb-5 h-[48vh] min-h-70 overflow-hidden rounded-4xl border border-[#D6C8AF] bg-[#E6D8B8] lg:hidden">
            {service.image ? (
              <Image
                src={service.image}
                alt={service.name}
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

            <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-[#0B1F3A]/65 to-transparent" />

            <div className="absolute bottom-5 left-5 rounded-full bg-[#FFF7E8]/92 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.18em] text-[#0B1F3A]">
              Interior Service
            </div>

            {service.featured && (
              <div className="absolute right-5 top-5 rounded-full bg-[#E8C77A] px-4 py-2 text-[9px] font-bold uppercase tracking-[0.18em] text-[#0B1F3A]">
                Featured
              </div>
            )}
          </div>

          {/* =================================================
              RIGHT SERVICE INFORMATION

              KEEP THIS SCROLL EXACTLY AS IT IS.
          ================================================== */}

          <div className="min-h-0 overflow-y-auto overscroll-contain pr-1 lg:scrollbar-thin">
            <div className="space-y-5 pb-5">
              {/* =================================================
                  SERVICE INTRO
              ================================================== */}

              <section className="rounded-4xl border border-[#D6C8AF] bg-[#F3E7D0] p-7 sm:p-9">
                <div className="flex flex-wrap gap-2">
                  {service.featured && (
                    <span className="rounded-full bg-[#E8C77A] px-4 py-2 text-[9px] font-bold uppercase tracking-[0.15em] text-[#0B1F3A]">
                      Featured Service
                    </span>
                  )}

                  <span className="rounded-full bg-[#FFF7E8] px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#5B6573]">
                    Interior Design Service
                  </span>
                </div>

                <div className="mt-6 h-px w-12 bg-[#C79B3B]" />

                <h1
                  className="mt-5 text-[clamp(2.8rem,5vw,5.8rem)] font-normal leading-[0.9] tracking-[-0.035em]"
                  style={displayFont}
                >
                  {service.name}
                </h1>

                {service.shortDescription && (
                  <p className="mt-6 text-sm leading-7 text-[#5B6573] sm:text-base">
                    {service.shortDescription}
                  </p>
                )}

                {/* SERVICE QUICK FACT */}

                {service.startingPrice != null && (
                  <div className="mt-7 overflow-hidden rounded-4xl border border-[#D6C8AF] bg-[#FFF7E8]">
                    <div className="p-5">
                      <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#8A847A]">
                        Starting investment
                      </p>

                      <p
                        className="mt-2 text-3xl sm:text-4xl"
                        style={displayFont}
                      >
                        ₹
                        {service.startingPrice.toLocaleString(
                          "en-IN"
                        )}
                      </p>

                      <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-[#8A847A]">
                        Starting from
                      </p>
                    </div>
                  </div>
                )}
              </section>

              {/* =================================================
                  ABOUT SERVICE
              ================================================== */}

              <section className="rounded-4xl border border-[#D6C8AF] bg-[#F3E7D0] p-7 sm:p-8">
                <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#8A847A]">
                  The service
                </p>

                <h2
                  className="mt-3 text-[clamp(2.5rem,4vw,4rem)] font-normal leading-[0.92]"
                  style={displayFont}
                >
                  Designed around what you need.
                </h2>

                <p className="mt-5 whitespace-pre-line text-sm leading-7 text-[#5B6573] sm:text-base">
                  {service.description}
                </p>
              </section>

              {/* =================================================
                  WHAT'S INCLUDED
              ================================================== */}

              {service.features?.length > 0 && (
                <section className="rounded-4xl border border-[#D6C8AF] bg-white/45 p-7 sm:p-8">
                  <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#8A847A]">
                    Service scope
                  </p>

                  <h2
                    className="mt-2 text-3xl sm:text-4xl"
                    style={displayFont}
                  >
                    What’s Included
                  </h2>

                  <div className="mt-6 space-y-3">
                    {service.features.map(
                      (feature, index) => (
                        <div
                          key={`${feature}-${index}`}
                          className="flex items-start gap-4 rounded-3xl border border-[#D6C8AF] bg-[#F3E7D0] px-5 py-4"
                        >
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0B1F3A] text-[10px] font-bold text-[#F3E7D0]">
                            {String(
                              index + 1
                            ).padStart(2, "0")}
                          </span>

                          <p className="pt-1 text-sm leading-6 text-[#0B1F3A]">
                            {feature}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </section>
              )}

              {/* =================================================
                  PRICE / SERVICE VALUE
              ================================================== */}

              {service.startingPrice != null && (
                <section className="rounded-4xl bg-[#0B1F3A] p-7 text-[#FFF7E8] sm:p-8">
                  <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#DCC9AA]">
                    Investment
                  </p>

                  <h2
                    className="mt-2 text-4xl sm:text-5xl"
                    style={displayFont}
                  >
                    Start your project.
                  </h2>

                  <p className="mt-4 text-2xl font-semibold tracking-tight">
                    ₹
                    {service.startingPrice.toLocaleString(
                      "en-IN"
                    )}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-[#DCC9AA]">
                    Starting price for this service. Final
                    pricing can vary based on your space,
                    requirements, and project scope.
                  </p>
                </section>
              )}

              {/* =================================================
                  ENQUIRY CTA
              ================================================== */}

              <section className="rounded-4xl bg-[#0B1F3A] px-7 py-9 text-[#FFF7E8] sm:px-8">
                <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-[#DCC9AA]">
                  Ready to get started?
                </p>

                <h2
                  className="mt-3 text-4xl leading-[0.95] sm:text-5xl"
                  style={displayFont}
                >
                  Let’s shape your space.
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-6 text-[#DCC9AA]">
                  Tell us about your space, your requirements,
                  and what you want to create. Our team can
                  help you understand the next steps.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  

                  <Link
                    href="/services"
                    className="rounded-full border border-[#F3E7D0]/30 px-6 py-3 text-[9px] font-bold uppercase tracking-[0.18em] text-[#F3E7D0] transition hover:bg-[#F3E7D0]/10"
                  >
                    Explore Services
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