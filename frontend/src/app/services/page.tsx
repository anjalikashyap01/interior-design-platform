"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Show,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import {
  publicServiceApi,
  type Service,
} from "@/lib/api";
import "@fontsource/berkshire-swash/400.css";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [heroSlide, setHeroSlide] = useState(0);

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
    const interval = window.setInterval(() => {
      setHeroSlide((current) => (current + 1) % 3);
    }, 4500);

    return () => window.clearInterval(interval);
  }, []);

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
    <main className="min-h-screen w-full overflow-x-hidden bg-[#FFF7E8] text-[#0B1F3A]" style={{ fontFamily: "'Manrope'" }}>
      {/* =====================================================
          NAVBAR
      ====================================================== */}
      <header className="fixed inset-x-0 top-0 z-100 border-b border-[#F3E7D0]/15 bg-[#0B1F3A] shadow-[0_8px_30px_rgba(11,31,58,0.12)]">
        <div className="mx-auto flex h-19 max-w-[1600px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <Link href="/" className="group">
            <div>
              <p style={{ fontFamily: "'Berkshire Swash'" }} className="text-2xl font-medium leading-none tracking-[0.24em] text-[#F3E7D0] sm:text-[28px]">
                STUDIO
              </p>
              <p className="mt-2 text-[8px] uppercase tracking-[0.34em] text-[#DCC9AA]">
                Interior Design
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
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
              className="text-[10px] uppercase tracking-[0.2em] text-[#FFFFFF] transition"
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

          <div className="flex items-center gap-3">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="hidden text-[10px] uppercase tracking-[0.16em] text-[#F3E7D0]/90 transition hover:text-white sm:block">
                  Sign In
                </button>
              </SignInButton>
            </Show>

            <Link
              href="/consultation"
              className="hidden rounded-full bg-[#F3E7D0] px-6 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#0B1F3A] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-lg sm:inline-flex sm:items-center"
            >
              Book a Consultation
              <span className="ml-2 text-sm leading-none">→</span>
            </Link>

            <Show when="signed-in">
              <div className="hidden sm:block">
                <UserButton />
              </div>
            </Show>

            <button
              type="button"
              aria-label="Open navigation"
              onClick={() => setMobileMenuOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#F3E7D0]/30 lg:hidden"
            >
              <span className="space-y-1.5">
                <span className="block h-px w-5 bg-[#F3E7D0]" />
                <span className="block h-px w-5 bg-[#F3E7D0]" />
                <span className="block h-px w-5 bg-[#F3E7D0]" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile navigation — same interaction pattern as the main Home page */}
      <div
        className={`fixed inset-0 z-110 lg:hidden transition-opacity duration-300 ${
          mobileMenuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <div
          className="absolute inset-0 bg-[#0B1F3A]/40"
          onClick={() => setMobileMenuOpen(false)}
        />

        <div
          className={`absolute right-0 top-0 h-full w-[85%] max-w-sm bg-[#0B1F3A] p-7 text-[#F3E7D0] shadow-2xl transition-transform duration-500 ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p style={{ fontFamily: "'Berkshire Swash'" }} className="text-xl tracking-[0.18em]">
                STUDIO<span className="text-[#DCC9AA]">.</span>
              </p>
              <p className="mt-1 text-[8px] uppercase tracking-[0.25em] text-[#DCC9AA]">
                Interior Design
              </p>
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#F3E7D0]/30 text-xl"
              aria-label="Close navigation"
            >
              ×
            </button>
          </div>

          <nav className="mt-16 flex flex-col gap-7">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontFamily: "'Berkshire Swash'" }} className="text-3xl"
            >
              Home
            </Link>
            <Link
              href="/designs"
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontFamily: "'Berkshire Swash'" }} className="text-3xl"
            >
              Designs
            </Link>
            <Link
              href="/services"
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontFamily: "'Berkshire Swash'" }} className="text-3xl"
            >
              Services
            </Link>
            <Link
              href="/#portfolio"
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontFamily: "'Berkshire Swash'" }} className="text-3xl"
            >
              Projects
            </Link>
            <Link
              href="/#about"
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontFamily: "'Berkshire Swash'" }} className="text-3xl"
            >
              About
            </Link>
            <Link
              href="/#contact"
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontFamily: "'Berkshire Swash'" }} className="text-3xl"
            >
              Contact
            </Link>
          </nav>

          <Link
            href="/consultation"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-10 inline-flex items-center rounded-full bg-[#F3E7D0] px-6 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#0B1F3A]"
          >
            Book a Consultation
            <span className="ml-2 text-sm leading-none">→</span>
          </Link>
        </div>
      </div>

      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="relative isolate overflow-hidden border-b border-[#D6C8AF]/60 bg-[#F2E6CC] px-6 pb-8 pt-24 sm:px-10 sm:pb-9 sm:pt-25 lg:px-14 lg:pb-10 lg:pt-26">
        {/* Soft rotating interior imagery behind the editorial heading */}
        <div className="absolute inset-0 -z-10">
          {[
            "/images/services/home/Home-1.jpg.jpg",
            "/images/services/cafe/Cafe-1.jpg.jpg",
            "/images/services/office/office-1.jpg.jpg",
          ].map((src, index) => (
            <div
              key={src}
              className={`absolute inset-0 transition-opacity duration-1400ms ${
                heroSlide === index ? "opacity-[0.30]" : "opacity-0"
              }`}
            >
              <Image
                src={src}
                alt=""
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
              />
            </div>
          ))}

          <div className="absolute inset-0 bg-[#F2E6CC]/50" />
        </div>

        <div className="mx-auto max-w-[1600px]">
          <h1 style={{ fontFamily: "'Berkshire Swash'" }} className="text-[clamp(3.1rem,7vw,7rem)] font-normal leading-[0.88] tracking-[-0.035em] text-[#0B1F3A]">
            Designing spaces
            <br />
            <span className="text-[#274C77]">around the way you live.</span>
          </h1>

          <p className="mt-4 max-w-2xl text-[11px] font-medium uppercase tracking-[0.24em] text-[#5B6573] sm:text-xs">
            Thoughtful interiors, shaped around you.
          </p>
        </div>
      </section>

      {/* =====================================================
          SERVICES
      ====================================================== */}
      <section className="bg-[#FFF7E8] px-6 py-14 sm:px-10 sm:py-16 lg:px-14 lg:py-20">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-7 border-b border-[#D6C8AF] pb-4">
            <h2 style={{ fontFamily: "'Berkshire Swash'" }} className="text-4xl font-normal leading-none text-[#0B1F3A] sm:text-5xl">
              Our expertise
            </h2>
          </div>

          {/* Loading */}
          {loading && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="animate-pulse overflow-hidden bg-[#F2E6CC]"
                >
                  <div className="h-72 bg-[#E6D8B8]" />
                  <div className="space-y-3 px-6 py-6">
                    <div className="h-7 w-2/5 rounded bg-[#D6C8AF]" />
                    <div className="h-3 w-full rounded bg-[#D6C8AF]" />
                    <div className="h-3 w-4/5 rounded bg-[#D6C8AF]" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="border border-[#D6C8AF] bg-[#F2E6CC] px-6 py-16 text-center">
              <p className="text-sm text-[#7A3F3F]">{error}</p>

              <button
                type="button"
                onClick={handleRetry}
                className="mt-6 rounded-full bg-[#274C77] px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#FFF7E8] transition hover:bg-[#0B1F3A]"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && services.length === 0 && (
            <div className="border border-[#D6C8AF] bg-[#F2E6CC] px-6 py-16 text-center">
              <p style={{ fontFamily: "'Berkshire Swash'" }} className="text-3xl text-[#0B1F3A]">
                Services are coming soon.
              </p>
              <p className="mt-3 text-sm text-[#7A7F86]">
                No services are currently available.
              </p>
            </div>
          )}

          {/* Service cards */}
          {!loading && !error && services.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => (
                <article
                  key={service._id}
                  className={`group overflow-hidden bg-[#F2E6CC] transition-transform duration-500 hover:-translate-y-1 ${
                    index === 0 ? "lg:col-span-2" : ""
                  }`}
                >
                  <div
                    className={`relative overflow-hidden bg-[#E6D8B8] ${
                      index === 0
                        ? "aspect-[1.9/1] sm:aspect-[1.8/1]"
                        : "aspect-1.25/1"
                    }`}
                  >
                    {service.image ? (
                      <Image
                        src={service.image}
                        alt={service.name}
                        fill
                        sizes={
                          index === 0
                            ? "(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 66vw"
                            : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        }
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs uppercase tracking-[0.18em] text-[#7A7F86]">
                        No image available
                      </div>
                    )}

                    <div className="absolute inset-0 bg-linear-to-t from-[#0B1F3A]/65 via-[#0B1F3A]/5 to-transparent opacity-80" />

                    <div className="absolute left-5 top-5 flex items-center gap-3">
                      <span className="text-[10px] font-semibold tracking-[0.2em] text-[#FFF7E8]/80">
                        {String(index + 1).padStart(2, "0")}
                      </span>


                    </div>

                    <div className="absolute bottom-5 left-5 right-5">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#F3E7D0]/80">
                        Interior Design
                      </p>

                      <h3 style={{ fontFamily: "'Berkshire Swash'" }} className="mt-1 text-3xl font-normal leading-none text-[#FFF7E8] sm:text-4xl">
                        {service.name}
                      </h3>
                    </div>
                  </div>

                  <div className="px-5 pb-6 pt-5 sm:px-6">
                    <p className="max-w-xl text-[13px] leading-6 text-[#5B6573]">
                      {service.shortDescription || service.description}
                    </p>

                    <div className="mt-5 flex items-end justify-between gap-4 border-t border-[#D6C8AF] pt-4">
                      <div>
                        {service.startingPrice != null && (
                          <>
                            <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-[#7A7F86]">
                              Starting from
                            </p>
                            <p style={{ fontFamily: "'Berkshire Swash'" }} className="mt-1 text-xl text-[#0B1F3A]">
                              ₹{service.startingPrice}
                            </p>
                          </>
                        )}
                      </div>

                      <Link
                        href={`/services/${service.slug}`}
                        className="group/link inline-flex items-center gap-2 rounded-full bg-[#274C77] px-5 py-2.5 text-[9px] font-semibold uppercase tracking-[0.17em] text-[#FFF7E8] transition-all duration-300 hover:bg-[#0B1F3A]"
                      >
                        Explore Service
                        <span className="text-sm leading-none transition-transform duration-300 group-hover/link:translate-x-1">
                          →
                        </span>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          PROCESS
      ====================================================== */}
      <section className="relative isolate overflow-hidden bg-[#E6D8B8] px-5 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-14">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/services/home/Home-2.jpg.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-[0.32]"
          />
          <div className="absolute inset-0 bg-[#E6D8B8]/[0.58]" />
        </div>

        <div className="mx-auto max-w-[1600px]">
          {/* Process title block */}
          <div className="flex justify-center">
            <div className="rounded-4xl bg-[#F3E7D0]/45 px-7 py-4 shadow-[0_8px_24px_rgba(11,31,58,0.04)] sm:px-10 sm:py-5">
              <h2 className="text-center  text-[clamp(2rem,4vw,4.5rem)] font-normal leading-none tracking-[-0.02em] text-[#0B1F3A] sm:whitespace-nowrap">
                From first idea to final detail.
              </h2>
            </div>
          </div>

          {/* Connected process cards */}
          <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-stretch md:gap-0">
            <div className="flex-1 rounded-[1.75rem] border border-[#BFAF92] bg-[#F3E7D0]/60 p-5 shadow-[0_8px_24px_rgba(11,31,58,0.04)] sm:p-6">
              <h3 style={{ fontFamily: "'Berkshire Swash'" }} className="mt-2 text-3xl font-normal leading-none text-[#0B1F3A]">
                Discover
              </h3>
              <p className="mt-3 max-w-sm text-xs leading-5.5 text-[#5B6573]">
                We understand your space, lifestyle, needs and ideas.
              </p>
            </div>

            <div className="flex items-center justify-center px-1 py-1 md:w-16 md:px-2">
              <div className="flex items-center text-[#274C77]">
                <span className="hidden h-px w-7 bg-[#274C77]/45 md:block" />
                <span className="text-2xl leading-none">→</span>
              </div>
            </div>

            <div className="flex-1 rounded-[1.75rem] border border-[#BFAF92] bg-[#F3E7D0]/60 p-5 shadow-[0_8px_24px_rgba(11,31,58,0.04)] sm:p-6">
              <h3 style={{ fontFamily: "'Berkshire Swash'" }} className="mt-2 text-3xl font-normal leading-none text-[#0B1F3A]">
                Design
              </h3>
              <p className="mt-3 max-w-sm text-xs leading-5.5 text-[#5B6573]">
                Concepts, materials and details come together around you.
              </p>
            </div>

            <div className="flex items-center justify-center px-1 py-1 md:w-16 md:px-2">
              <div className="flex items-center text-[#274C77]">
                <span className="hidden h-px w-7 bg-[#274C77]/45 md:block" />
                <span className="text-2xl leading-none">→</span>
              </div>
            </div>

            <div className="flex-1 rounded-[1.75rem] border border-[#BFAF92] bg-[#F3E7D0]/60 p-5 shadow-[0_8px_24px_rgba(11,31,58,0.04)] sm:p-6">
              <h3 style={{ fontFamily: "'Berkshire Swash'" }} className="mt-2 text-3xl font-normal leading-none text-[#0B1F3A]">
                Create
              </h3>
              <p className="mt-3 max-w-sm text-xs leading-5.5 text-[#5B6573]">
                We turn the approved vision into a finished, considered space.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CTA
      ====================================================== */}
      <section className="bg-[#0B1F3A] px-6 py-8 text-[#FFF7E8] sm:px-10 sm:py-9 lg:px-14 lg:py-10">
        <div className="mx-auto flex max-w-[1600px] items-start justify-between gap-8">
          <h2 style={{ fontFamily: "'Berkshire Swash'" }} className="max-w-2xl text-3xl font-normal leading-[0.94] sm:text-4xl lg:text-5xl">
            Have a space
            <br />
            <span className="text-[#DCC9AA]">in mind?</span>
          </h2>

          <Link
            href="/consultation"
            className="mt-1 inline-flex shrink-0 items-center rounded-full bg-[#F3E7D0] px-6 py-3 text-[9px] font-bold uppercase tracking-[0.18em] text-[#0B1F3A] shadow-[0_8px_24px_rgba(0,0,0,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white sm:px-7 sm:py-3.5"
          >
            Book a Consultation
            <span className="ml-2 text-sm leading-none">→</span>
          </Link>
        </div>
      </section>

    </main>
  );
}
