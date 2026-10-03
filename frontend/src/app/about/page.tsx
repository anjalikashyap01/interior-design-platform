"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  publicAboutApi,
  type About,
} from "@/lib/api";

import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";

/* =========================================================
   PAGE
========================================================= */

export default function AboutPage() {
  const [about, setAbout] = useState<About | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =======================================================
     FULL PAGE SCROLL BEHAVIOUR
     Same scrolling setup as the main page.
  ======================================================= */

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    const previousRootBackground =
      root.style.backgroundColor;

    const previousBodyBackground =
      body.style.backgroundColor;

    const previousRootOverflowX =
      root.style.overflowX;

    const previousBodyOverflowX =
      body.style.overflowX;

    const previousRootOverflowY =
      root.style.overflowY;

    const previousBodyOverflowY =
      body.style.overflowY;

    const previousRootOverscroll =
      root.style.overscrollBehavior;

    const previousBodyOverscroll =
      body.style.overscrollBehavior;

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

      root.style.overflowX =
        previousRootOverflowX;

      body.style.overflowX =
        previousBodyOverflowX;

      root.style.overflowY =
        previousRootOverflowY;

      body.style.overflowY =
        previousBodyOverflowY;

      root.style.overscrollBehavior =
        previousRootOverscroll;

      body.style.overscrollBehavior =
        previousBodyOverscroll;

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

  /* =======================================================
     LOAD ABOUT
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    const loadAbout = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await publicAboutApi.getAbout();

        if (mounted) {
          setAbout(data);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load About page."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadAbout();

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return <AboutPageSkeleton />;
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (error || !about) {
    return (
      <main
        className="min-h-screen bg-[#FFF7E8] px-6 py-24 text-[#0B1F3A]"
        style={{
          fontFamily: "'Manrope', sans-serif",
        }}
      >
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[#C79B3B]">
            About
          </p>

          <h1
            className="mt-5 text-4xl font-normal tracking-tight sm:text-5xl"
            style={{
              fontFamily:
                "'Cormorant Garamond', serif",
            }}
          >
            Something went wrong.
          </h1>

          <p className="mt-4 text-sm leading-7 text-[#5B6573]">
            {error ||
              "About information is unavailable."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen overflow-x-hidden bg-[#FFF7E8] text-[#0B1F3A]"
      style={{
        fontFamily: "'Manrope', sans-serif",
      }}
    >

      <header className="fixed left-0 right-0 top-0 z-100 border-b border-[#F3E7D0]/15 bg-[#0B1F3A] shadow-[0_8px_30px_rgba(11,31,58,0.12)]">
  <div className="mx-auto flex h-19 max-w-[1600px] items-center justify-between px-5 sm:px-8 lg:px-12">
    <Link href="/" className="group shrink-0">
      <p className="text-2xl font-medium leading-none tracking-[0.24em] text-[#F3E7D0] sm:text-[28px]">
        STUDIO
      </p>

      <p className="mt-2 text-[8px] uppercase tracking-[0.34em] text-[#DCC9AA]">
        Interior Design
      </p>
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
        href="/about"
        className="text-[10px] uppercase tracking-[0.2em] text-white"
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

    <Link
      href="/consultation"
      className="inline-flex items-center rounded-full bg-[#F3E7D0] px-6 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#0B1F3A] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white"
    >
      Book a Consultation
      <span className="ml-2 text-sm leading-none">→</span>
    </Link>
  </div>
</header>


      <HeroSection about={about} />

      <StorySection about={about} />

      <PhilosophySection about={about} />

      <FounderSection about={about} />

      <ProcessSection about={about} />

      <MaterialsSection about={about} />

      <BrandsSection about={about} />

      <TrustSection about={about} />

      <CtaSection about={about} />
    </main>
  );
}

/* =========================================================
   HERO
========================================================= */

function HeroSection({
  about,
}: {
  about: About;
}) {
  const images = about.hero.images ?? [];

  return (
    <section className="relative overflow-hidden bg-[#FFF7E8] px-5 pb-16 pt-10 sm:px-8 sm:pb-20 sm:pt-12 lg:px-12 lg:pb-24 lg:pt-14">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          {/* LEFT */}

          <div className="max-w-2xl">
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.34em] text-[#A77A32]">
              About the Studio
            </p>

            <h1
              className="text-[clamp(3.8rem,7vw,7.2rem)] font-normal leading-[0.82] tracking-[-0.04em] text-[#0B1F3A]"
              style={{
                fontFamily:
                  "'Cormorant Garamond', serif",
              }}
            >
              {about.hero.heading}
            </h1>

            <p className="mt-7 max-w-xl text-sm leading-7 text-[#5B6573] sm:text-[15px] sm:leading-7">
              {about.hero.description}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/consultation"
                className="group inline-flex items-center gap-4 rounded-full bg-[#274C77] px-6 py-3.5 text-[9px] font-bold uppercase tracking-[0.2em] text-[#F3E7D0] shadow-[0_10px_25px_rgba(39,76,119,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0B1F3A]"
              >
                Start a Conversation

                <span className="text-base leading-none transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <Link
                href="/designs"
                className="inline-flex items-center rounded-full border border-[#CFC3B0] px-6 py-3.5 text-[9px] font-bold uppercase tracking-[0.2em] text-[#274C77] transition-all duration-300 hover:border-[#274C77] hover:bg-[#274C77] hover:text-[#F3E7D0]"
              >
                Explore Our Designs
              </Link>
            </div>
          </div>

          {/* RIGHT — IMAGE COMPOSITION */}

          <HeroImageComposition images={images} />
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   HERO IMAGE COMPOSITION
========================================================= */

function HeroImageComposition({
  images,
}: {
  images: About["hero"]["images"];
}) {
  if (images.length === 0) {
    return (
      <div className="relative aspect-4/3 overflow-hidden rounded-4xl bg-[#E8D9C0]">
        <div className="absolute inset-0 flex items-center justify-center text-sm text-[#5B6573]">
          Studio image
        </div>
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className="relative overflow-hidden rounded-4xl border border-[#D6C8AF]">
        <div className="aspect-4/3">
          <CloudinaryImage
            src={images[0].url}
            alt={images[0].alt || "Interior design"}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-105 sm:h-125 lg:h-140">
      {/* MAIN IMAGE */}

      <div className="absolute right-0 top-0 w-[76%] overflow-hidden rounded-4xl border border-[#D6C8AF] shadow-[0_18px_45px_rgba(11,31,58,0.08)]">
        <div className="aspect-4/5">
          <CloudinaryImage
            src={images[0].url}
            alt={images[0].alt || "Interior design"}
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* SECOND IMAGE */}

      <div className="absolute bottom-[3%] left-0 z-10 w-[48%] overflow-hidden rounded-3xl border-[7px] border-[#FFF7E8] shadow-[0_18px_45px_rgba(11,31,58,0.14)]">
        <div className="aspect-4/5">
          <CloudinaryImage
            src={images[1].url}
            alt={images[1].alt || "Interior design detail"}
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* SMALL IMAGE */}

      {images[2] && (
        <div className="absolute bottom-[9%] right-[2%] z-20 hidden w-[27%] overflow-hidden rounded-[1.25rem] border-4 border-[#FFF7E8] shadow-[0_12px_30px_rgba(11,31,58,0.14)] md:block">
          <div className="aspect-square">
            <CloudinaryImage
              src={images[2].url}
              alt={images[2].alt || "Interior design detail"}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   STORY
========================================================= */

function StorySection({
  about,
}: {
  about: About;
}) {
  return (
    <section className="border-t border-[#D6C8AF]/50 bg-white px-5 py-12 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid items-center gap-8 lg:grid-cols-[0.7fr_0.9fr_0.8fr] lg:gap-10">
          {/* LABEL + HEADING */}

          <div>
            <SectionEyebrow text="01 / Our Story" />

            <h2
              className="mt-4 max-w-md text-3xl font-normal leading-[0.92] tracking-[-0.035em] sm:text-4xl lg:text-[3.1rem]"
              style={{
                fontFamily:
                  "'Cormorant Garamond', serif",
              }}
            >
              {about.story.heading}
            </h2>
          </div>

          {/* DESCRIPTION */}

          <div>
            <p className="max-w-lg whitespace-pre-line text-sm leading-7 text-[#5B6573] sm:text-[15px] sm:leading-7">
              {about.story.content}
            </p>
          </div>

          {/* IMAGE */}

          {about.story.image ? (
            <div className="overflow-hidden rounded-3xl border border-[#D6C8AF]/70">
              <div className="aspect-4/3">
                <CloudinaryImage
                  src={about.story.image.url}
                  alt={
                    about.story.image.alt ||
                    "Our studio"
                  }
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
                />
              </div>
            </div>
          ) : (
            <div className="flex aspect-4/3 items-center justify-center rounded-3xl bg-[#E8D9C0] text-sm text-[#5B6573]">
              Story Image
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   DESIGN PHILOSOPHY
========================================================= */

function PhilosophySection({
  about,
}: {
  about: About;
}) {
  return (
    <section className="relative bg-[#0B1F3A] px-5 py-12 text-[#FFF7E8] sm:px-8 sm:py-14 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid items-center gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-14">
          <div>
            <SectionEyebrow
              text="02 / Design Philosophy"
              dark
            />
          </div>

          <div>
            <h2
              className="max-w-4xl text-3xl font-normal leading-[0.92] tracking-[-0.035em] sm:text-4xl lg:text-5xl"
              style={{
                fontFamily:
                  "'Cormorant Garamond', serif",
              }}
            >
              {about.designPhilosophy.heading}
            </h2>

            <p className="mt-5 max-w-3xl whitespace-pre-line text-sm leading-7 text-[#FFF7E8]/65 sm:text-[15px]"
            >
              {about.designPhilosophy.content}
            </p>

            <div className="mt-7 h-px w-full bg-[#F3E7D0]/15" />

            <div className="mt-4 flex items-center justify-between text-[9px] font-semibold uppercase tracking-[0.28em] text-[#DCC9AA] sm:text-[10px]">
              <span>Thoughtful</span>
              <span>Timeless</span>
              <span>Personal</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   FOUNDER
========================================================= */

function FounderSection({
  about,
}: {
  about: About;
}) {
  const highlights =
    about.founder.highlights ?? [];

  return (
    <section className="bg-[#FFF7E8] px-5 py-14 sm:px-8 sm:py-18 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          {/* PHOTO */}

          <div>
            {about.founder.photo ? (
              <div className="overflow-hidden rounded-4xl border border-[#D6C8AF]/70 shadow-[0_15px_35px_rgba(11,31,58,0.06)]">
                <div className="aspect-4/5">
                  <CloudinaryImage
                    src={
                      about.founder.photo.url
                    }
                    alt={
                      about.founder.photo.alt ||
                      about.founder.name
                    }
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            ) : (
              <div className="flex aspect-4/5 items-center justify-center rounded-4xl bg-[#E8D9C0] text-sm text-[#5B6573]">
                Founder Photo
              </div>
            )}
          </div>

          {/* CONTENT */}

          <div>
            <SectionEyebrow text="03 / The Person Behind It" />

            <h2
              className="mt-4 text-4xl font-normal tracking-[-0.04em] sm:text-5xl lg:text-6xl"
              style={{
                fontFamily:
                  "'Cormorant Garamond', serif",
              }}
            >
              {about.founder.name}
            </h2>

            <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.24em] text-[#A77A32]">
              {about.founder.role}
            </p>

            <p className="mt-6 max-w-2xl whitespace-pre-line text-sm leading-7 text-[#5B6573] sm:text-[15px]">
              {about.founder.bio}
            </p>

            {highlights.length > 0 && (
              <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-[#D6C8AF] bg-[#D6C8AF] sm:grid-cols-3">
                {highlights.map(
                  (highlight, index) => (
                    <div
                      key={`${highlight.label}-${index}`}
                      className="bg-white p-4 sm:p-5"
                    >
                      <p
                        className="text-2xl font-normal text-[#0B1F3A]"
                        style={{
                          fontFamily:
                            "'Cormorant Garamond', serif",
                        }}
                      >
                        {highlight.value}
                      </p>

                      <p className="mt-1 text-[9px] font-semibold uppercase leading-4 tracking-[0.16em] text-[#7A7F86]">
                        {highlight.label}
                      </p>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   PROCESS
========================================================= */

function ProcessSection({
  about,
}: {
  about: About;
}) {
  const steps = about.processSteps ?? [];

  if (steps.length === 0) {
    return null;
  }

  return (
    <section className="border-y border-[#D6C8AF]/50 bg-white px-5 py-14 sm:px-8 sm:py-18 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <SectionEyebrow text="04 / How We Work" />

            <h2
              className="mt-4 max-w-2xl text-4xl font-normal leading-[0.9] tracking-[-0.04em] sm:text-5xl"
              style={{
                fontFamily:
                  "'Cormorant Garamond', serif",
              }}
            >
              From first conversation
              <br />
              to final detail.
            </h2>
          </div>

          <p className="max-w-sm text-sm leading-6 text-[#5B6573]">
            A considered process keeps every project
            clear, personal and intentional.
          </p>
        </div>

        <div className="relative mt-12">
          <div className="absolute left-[8%] right-[8%] top-7 hidden border-t border-dashed border-[#CFC3B0] lg:block" />

          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-5 lg:gap-5">
            {steps.map((step, index) => (
              <div
                key={`${step.number}-${index}`}
                className="relative"
              >
                <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-[#C79B3B]/60 bg-[#FFF7E8] text-[10px] font-bold text-[#274C77]">
                  {step.number}
                </div>

                <div className="mt-5">
                  <h3
                    className="text-xl font-normal text-[#0B1F3A]"
                    style={{
                      fontFamily:
                        "'Cormorant Garamond', serif",
                    }}
                  >
                    {step.title}
                  </h3>

                  {step.description && (
                    <p className="mt-2 max-w-xs text-[12px] leading-5.5 text-[#7A7F86]">
                      {step.description}
                    </p>
                  )}
                </div>

                {index <
                  steps.length - 1 && (
                  <div className="mt-6 text-lg text-[#C79B3B] lg:hidden">
                    ↓
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   MATERIALS
========================================================= */

function MaterialsSection({
  about,
}: {
  about: About;
}) {
  const materials = about.materials ?? [];

  if (materials.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#FFF7E8] px-5 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-14">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-10">
          {/* HEADING */}

          <div className="shrink-0 lg:w-[29%]">
            <SectionEyebrow text="05 / Materials & Expertise" />

            <h2
              className="mt-3 max-w-sm text-3xl font-normal leading-[0.94] tracking-[-0.04em] sm:text-4xl"
              style={{
                fontFamily:
                  "'Cormorant Garamond', serif",
              }}
            >
              Details that make a space feel considered.
            </h2>
          </div>

          {/* HORIZONTAL MATERIALS */}

          <div className="min-w-0 flex-1">
            <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none [&::-webkit-scrollbar]:hidden">
              {materials.map(
                (material, index) => (
                  <div
                    key={`${material.name}-${index}`}
                    className="flex min-w-36.25 flex-1 items-center gap-3 rounded-xl border border-[#D6C8AF] bg-white px-3.5 py-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C79B3B]/60 hover:shadow-[0_8px_20px_rgba(11,31,58,0.05)]"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#C79B3B]/50 text-[9px] font-semibold text-[#A77A32]">
                      {String(index + 1).padStart(
                        2,
                        "0"
                      )}
                    </span>

                    <span className="text-[12px] font-semibold leading-5 text-[#0B1F3A]">
                      {material.name}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   TRUSTED BRANDS
========================================================= */

function BrandsSection({
  about,
}: {
  about: About;
}) {
  const brands = (
    about.trustedBrands ?? []
  ).filter((brand) => brand.visible);

  if (brands.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-[#D6C8AF]/50 bg-white px-5 py-14 sm:px-8 sm:py-18 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <SectionEyebrow text="06 / Trusted Brands" />

            <h2
              className="mt-3 max-w-2xl text-4xl font-normal tracking-[-0.04em] sm:text-5xl"
              style={{
                fontFamily:
                  "'Cormorant Garamond', serif",
              }}
            >
              Partners and materials we trust.
            </h2>
          </div>

          <p className="max-w-xs text-xs leading-5.5 text-[#7A7F86]">
            Carefully selected brands and suppliers
            that support the quality of our work.
          </p>
        </div>

        <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map(
            (brand, index) => (
              <div
                key={`${brand.name}-${index}`}
                className="group rounded-2xl border border-[#D6C8AF] bg-[#FFFDF8] p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C79B3B]/50 hover:shadow-[0_12px_30px_rgba(11,31,58,0.05)]"
              >
                <div className="flex h-20 items-center">
                  {brand.logo ? (
                    <CloudinaryImage
                      src={brand.logo.url}
                      alt={
                        brand.logo.alt ||
                        brand.name
                      }
                      className="max-h-14 max-w-45 object-contain object-left grayscale transition duration-300 group-hover:grayscale-0"
                    />
                  ) : (
                    <span
                      className="text-2xl font-normal text-[#0B1F3A]"
                      style={{
                        fontFamily:
                          "'Cormorant Garamond', serif",
                      }}
                    >
                      {brand.name}
                    </span>
                  )}
                </div>

                <div className="mt-5 border-t border-[#D6C8AF]/70 pt-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#A77A32]">
                      {brand.category ||
                        "Partner"}
                    </span>

                    <span className="text-[9px] uppercase tracking-[0.14em] text-[#7A7F86]">
                      {formatRelationship(
                        brand.relationship
                      )}
                    </span>
                  </div>

                  {brand.description && (
                    <p className="mt-3 text-[12px] leading-5.5 text-[#7A7F86]">
                      {brand.description}
                    </p>
                  )}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   TRUST
========================================================= */

function TrustSection({
  about,
}: {
  about: About;
}) {
  const points = about.trustPoints ?? [];

  if (points.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#FFF7E8] px-5 py-14 sm:px-8 sm:py-18 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid gap-10 lg:grid-cols-[0.65fr_1.35fr] lg:gap-16">
          <div>
            <SectionEyebrow text="07 / Why Work With Us" />

            <h2
              className="mt-4 max-w-md text-4xl font-normal leading-[0.9] tracking-[-0.04em] sm:text-5xl"
              style={{
                fontFamily:
                  "'Cormorant Garamond', serif",
              }}
            >
              A design process built around you.
            </h2>
          </div>

          <div className="divide-y divide-[#D6C8AF] border-y border-[#D6C8AF]">
            {points.map(
              (point, index) => (
                <div
                  key={`${point.title}-${index}`}
                  className="grid gap-3 py-5 sm:grid-cols-[55px_0.8fr_1.2fr] sm:items-start"
                >
                  <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#C79B3B]">
                    {String(index + 1).padStart(
                      2,
                      "0"
                    )}
                  </span>

                  <h3
                    className="text-2xl font-normal tracking-tight text-[#0B1F3A]"
                    style={{
                      fontFamily:
                        "'Cormorant Garamond', serif",
                    }}
                  >
                    {point.title}
                  </h3>

                  <p className="text-[12px] leading-6 text-[#7A7F86]">
                    {point.description}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   FINAL CTA
   Styled to match the Home page CTA.
========================================================= */

function CtaSection({
  about,
}: {
  about: About;
}) {
  const backgroundImage =
    about.cta.backgroundImage;

  return (
    <section className="bg-[#FFF7E8] px-5 py-8 sm:px-8 sm:py-10 lg:px-12">
      <div className="relative mx-auto max-w-[1600px] overflow-hidden bg-[#0B1F3A] px-7 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-18">
        {/* BACKGROUND IMAGE */}

        {backgroundImage && (
          <>
            <CloudinaryImage
              src={backgroundImage.url}
              alt={
                backgroundImage.alt ||
                "Interior design"
              }
              className="absolute inset-0 h-full w-full object-cover opacity-30"
            />

            <div className="absolute inset-0 bg-[#0B1F3A]/75" />
          </>
        )}

        {/* DECORATIVE CIRCLE */}

        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-[#F3E7D0]/10" />

        <div className="pointer-events-none absolute -bottom-32 -left-24 h-64 w-64 rounded-full border border-[#C79B3B]/15" />

        <div className="relative flex flex-col justify-between gap-9 lg:flex-row lg:items-end">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#C79B3B]">
              Let&apos;s Create
            </p>

            <h2
              className="mt-3 max-w-4xl text-[clamp(3rem,6vw,6rem)] font-normal leading-[0.84] tracking-[-0.035em] text-[#F3E7D0]"
              style={{
                fontFamily:
                  "'Cormorant Garamond', serif",
              }}
            >
              {about.cta.heading}
            </h2>

            <p className="mt-6 max-w-2xl text-sm leading-7 text-[#FFF7E8]/60 sm:text-[15px]">
              {about.cta.description}
            </p>
          </div>

          <Link
            href="/consultation"
            className="group inline-flex w-fit shrink-0 items-center gap-5 rounded-full bg-[#274C77] px-7 py-4 text-[9px] font-bold uppercase tracking-[0.22em] text-[#F3E7D0] shadow-[0_8px_22px_rgba(39,76,119,0.25)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#F3E7D0] hover:text-[#0B1F3A]"
          >
            {about.cta.buttonText ||
              "Book a Consultation"}

            <span className="text-base leading-none transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function SectionEyebrow({
  text,
  dark = false,
}: {
  text: string;
  dark?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`h-px w-8 ${
          dark
            ? "bg-[#C79B3B]"
            : "bg-[#C79B3B]/70"
        }`}
      />

      <p
        className={`text-[9px] font-semibold uppercase tracking-[0.3em] ${
          dark
            ? "text-[#C79B3B]"
            : "text-[#A77A32]"
        }`}
      >
        {text}
      </p>
    </div>
  );
}

function CloudinaryImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className: string;
}) {
  return (
    // Direct Cloudinary rendering avoids the
    // Next.js image optimization timeout encountered
    // with these uploaded images.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
    />
  );
}

function formatRelationship(
  relationship: About["trustedBrands"][number]["relationship"]
) {
  switch (relationship) {
    case "preferred-supplier":
      return "Preferred Supplier";

    case "certified-partner":
      return "Certified Partner";

    case "official-partner":
      return "Official Partner";

    case "other":
      return "Partner";

    case "used":
    default:
      return "Used in Projects";
  }
}

/* =========================================================
   LOADING SKELETON
========================================================= */

function AboutPageSkeleton() {
  return (
    <main
      className="min-h-screen bg-[#FFF7E8]"
      style={{
        fontFamily: "'Manrope', sans-serif",
      }}
    >
      <div className="mx-auto max-w-[1600px] animate-pulse px-5 py-14 sm:px-8 lg:px-12">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <div className="h-3 w-32 rounded bg-[#E8D9C0]" />

            <div className="mt-7 h-24 max-w-xl rounded-xl bg-[#E8D9C0]" />

            <div className="mt-6 h-4 max-w-lg rounded bg-[#E8D9C0]" />

            <div className="mt-3 h-4 max-w-md rounded bg-[#E8D9C0]" />

            <div className="mt-7 h-12 w-48 rounded-full bg-[#E8D9C0]" />
          </div>

          <div className="aspect-4/3 rounded-4xl bg-[#E8D9C0]" />
        </div>

        <div className="mt-16 grid items-center gap-8 lg:grid-cols-3">
          <div>
            <div className="h-3 w-28 rounded bg-[#E8D9C0]" />
            <div className="mt-5 h-16 max-w-sm rounded-xl bg-[#E8D9C0]" />
          </div>

          <div className="h-24 rounded-xl bg-[#E8D9C0]" />

          <div className="aspect-4/3 rounded-3xl bg-[#E8D9C0]" />
        </div>
      </div>
    </main>
  );
}