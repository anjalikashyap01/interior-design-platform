"use client";

import { useEffect, useState, type PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Show,
  UserButton,
  SignInButton,
} from "@clerk/nextjs";

import {
  publicOfficeApi,
  publicTestimonialApi,
  type Office,
  type Testimonial,
} from "@/lib/api";

const homeScenes = [
  {
    id: 1,
    name: "Living Room",
    subtitle: "Spaces that bring people together",
    image: "/images/home-tour/01-living-room.jpg",
  },
  {
    id: 2,
    name: "Kitchen",
    subtitle: "Where function meets beauty",
    image: "/images/home-tour/02-kitchen.jpg",
  },
  {
    id: 3,
    name: "Dining",
    subtitle: "Moments made around the table",
    image: "/images/home-tour/03-dining.jpg",
  },
  {
    id: 4,
    name: "Bedroom",
    subtitle: "A more peaceful you",
    image: "/images/home-tour/04-bedroom.jpg",
  },
  {
    id: 5,
    name: "Bathroom",
    subtitle: "A space to refresh and reset",
    image: "/images/home-tour/05-bathroom.jpg",
  },
];

const serviceScenes = [
  {
    name: "Home",
    description: "Complete interior design solutions for your home.",
    images: [
      "/images/services/home/Home-1.jpg.jpg",
      "/images/services/home/Home-2.jpg.jpg",
      "/images/services/home/Home-3.jpg.jpg",
    ],
  },
  {
    name: "Cafe",
    description:
      "Creative and functional spaces for cafes and restaurants.",
    images: [
      "/images/services/cafe/Cafe-1.jpg.jpg",
      "/images/services/cafe/Cafe-2.jpg.jpg",
      "/images/services/cafe/Cafe-3.jpg.jpg",
    ],
  },
  {
    name: "Office",
    description:
      "Productive and inspiring workspaces for modern businesses.",
    images: [
      "/images/services/office/office-1.jpg.jpg",
      "/images/services/office/office-2.jpg.jpg",
      "/images/services/office/office-3.jpg.jpg",
    ],
  },
  {
    name: "Other",
    description:
      "Customized interior solutions for unique spaces and requirements.",
    images: [
      "/images/services/other/other-1.jpg.jpg",
      "/images/services/other/other-2.jpg.jpg",
      "/images/services/other/other-3.jpg.jpg",
    ],
  },

];

const PROJECT_BEFORE_IMAGE = "/images/projects/project-before.jpg";
const PROJECT_AFTER_IMAGE = "/images/projects/project-after.jpg";

export default function HomePage() {
  const [office, setOffice] = useState<Office | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [testimonialPage, setTestimonialPage] = useState(0);
  const [activeScene, setActiveScene] = useState(0);
  const [activeServiceScenes, setActiveServiceScenes] = useState([
    0,
    0,
    0,
    0,
  ]);
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

    root.style.setProperty("overflow-x", "hidden", "important");
    root.style.setProperty("overflow-y", "scroll", "important");
    root.style.setProperty(
      "overscroll-behavior-y",
      "none",
      "important"
    );
    root.style.setProperty("touch-action", "auto", "important");

    body.style.setProperty("overflow-x", "hidden", "important");
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
    const loadOffice = async () => {
      try {
        const data = await publicOfficeApi.getOffice();
        setOffice(data);
      } catch {
        setOffice(null);
      }
    };

    void loadOffice();
  }, []);

  useEffect(() => {
  const loadTestimonials = async () => {
    try {
      const data = await publicTestimonialApi.getTestimonials();

      console.log("🔥 HOME TESTIMONIALS:", data);
      console.log(
        "🔥 FIRST TESTIMONIAL IMAGE:",
        data[0]?.imageUrl
      );

      setTestimonials(data);
    } catch (error) {
      console.error(
        "❌ FAILED TO LOAD TESTIMONIALS:",
        error
      );

      setTestimonials([]);
    }
  };

  void loadTestimonials();
}, []);

  useEffect(() => {
    homeScenes.forEach((scene) => {
      const image = document.createElement("img");
      image.src = scene.image;
    });

    serviceScenes.forEach((service) => {
      service.images.forEach((imagePath) => {
        const image = document.createElement("img");
        image.src = imagePath;
      });
    });

    const rightSectionBackground = document.createElement("img");
    rightSectionBackground.src =
      "/images/home-tour/backgrounds/new-bg-3.jpg";
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveScene((current) =>
        current === homeScenes.length - 1 ? 0 : current + 1
      );
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveServiceScenes((current) =>
        current.map((sceneIndex, cardIndex) => {
          const imageCount =
            serviceScenes[cardIndex].images.length;

          return (sceneIndex + 1) % imageCount;
        })
      );
    }, 4500);

    return () => window.clearInterval(interval);
  }, []);

  const getRelativePosition = (index: number) => {
    let difference = index - activeScene;

    if (difference > 2) {
      difference -= homeScenes.length;
    }

    if (difference < -2) {
      difference += homeScenes.length;
    }

    return difference;
  };

  const testimonialsPerPage = 3;

  const totalTestimonialPages = Math.ceil(
    testimonials.length / testimonialsPerPage
  );

  const visibleTestimonials = testimonials.slice(
    testimonialPage * testimonialsPerPage,
    testimonialPage * testimonialsPerPage + testimonialsPerPage
  );

  return (
    <main
      className="min-h-screen overflow-x-hidden bg-[#FFF7E8] text-[#0B1F3A]"
      style={{ fontFamily: "'Manrope', sans-serif" }}
    >
      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <header className="fixed left-0 right-0 top-0 z-100 border-b border-[#F3E7D0]/15 bg-[#0B1F3A] shadow-[0_8px_30px_rgba(11,31,58,0.12)]">
        <div className="mx-auto flex h-19 max-w-[1600px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <Link href="/" className="group">
            <div className="flex items-center">
              <div>
                <p className="text-2xl font-medium leading-none tracking-[0.24em] text-[#F3E7D0] sm:text-[28px]">
                  STUDIO
                </p>

                <p className="mt-2 text-[8px] uppercase tracking-[0.34em] text-[#DCC9AA]">
                  Interior Design
                </p>
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            <a
              href="#home"
              className="text-[10px] uppercase tracking-[0.2em] text-[#F3E7D0]/90 transition hover:text-[#FFFFFF]"
            >
              Home
            </a>

            <Link
              href="/designs"
              className="text-[10px] uppercase tracking-[0.2em] text-[#F3E7D0]/90 transition hover:text-[#FFFFFF]"
            >
              Designs
            </Link>

            <a
              href="#services"
              className="text-[10px] uppercase tracking-[0.2em] text-[#F3E7D0]/90 transition hover:text-[#FFFFFF]"
            >
              Services
            </a>

            <a
              href="#portfolio"
              className="text-[10px] uppercase tracking-[0.2em] text-[#F3E7D0]/90 transition hover:text-[#FFFFFF]"
            >
              Projects
            </a>

            <a
              href="#reviews"
              className="text-[10px] uppercase tracking-[0.2em] text-[#F3E7D0]/90 transition hover:text-[#FFFFFF]"
            >
              Reviews
            </a>

            <Link
              href="/about"
              className="text-[10px] uppercase tracking-[0.2em] text-[#F3E7D0]/90 transition hover:text-[#FFFFFF]"
            >
              About
            </Link>

            <a
              href="#contact"
              className="text-[10px] uppercase tracking-[0.2em] text-[#F3E7D0]/90 transition hover:text-[#FFFFFF]"
            >
              Contact
            </a>

            <Link
  href="/admin/login"
  className="text-[10px] uppercase tracking-[0.2em] text-[#F3E7D0]/90 transition hover:text-[#FFFFFF]"
>
  Admin
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
              <span className="ml-2 text-sm leading-none">
                →
              </span>
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

      {/* =====================================================
          MOBILE MENU
      ====================================================== */}

      <div
        className={`fixed inset-0 z-60 transition-opacity duration-300 lg:hidden ${
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
            mobileMenuOpen
              ? "translate-x-0"
              : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl tracking-[0.18em] text-[#F3E7D0]">
                STUDIO
                <span className="text-[#DCC9AA]">.</span>
              </p>

              <p className="mt-1 text-[8px] uppercase tracking-[0.25em] text-[#DCC9AA]">
                Interior Design
              </p>
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#F3E7D0]/30 text-xl text-[#F3E7D0]"
              aria-label="Close navigation"
            >
              ×
            </button>
          </div>

          <nav className="mt-16 flex flex-col gap-7">
            <a
              href="#home"
              onClick={() => setMobileMenuOpen(false)}
              className="text-3xl text-[#F3E7D0]"
            >
              Home
            </a>

            <Link
              href="/designs"
              onClick={() => setMobileMenuOpen(false)}
              className="text-3xl text-[#F3E7D0]"
            >
              Designs
            </Link>

            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="text-3xl text-[#F3E7D0]"
            >
              Services
            </a>

            <a
              href="#portfolio"
              onClick={() => setMobileMenuOpen(false)}
              className="text-3xl text-[#F3E7D0]"
            >
              Projects
            </a>

            <a
              href="#reviews"
              onClick={() => setMobileMenuOpen(false)}
              className="text-3xl text-[#F3E7D0]"
            >
              Reviews
            </a>

            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="text-3xl text-[#F3E7D0]"
            >
              About
            </Link>

            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="text-3xl text-[#F3E7D0]"
            >
              Contact
            </a>

            <Link
  href="/admin/login"
  onClick={() => setMobileMenuOpen(false)}
  className="text-3xl text-[#F3E7D0]"
>
  Admin
</Link>
          </nav>

          <Link
            href="/consultation"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-10 inline-flex items-center rounded-full bg-[#F3E7D0] px-6 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#0B1F3A]"
          >
            Book a Consultation
            <span className="ml-2 text-sm leading-none">
              →
            </span>
          </Link>

          <div className="absolute bottom-8 left-7 right-7 border-t border-[#F3E7D0]/15 pt-6">
            <p className="text-[9px] uppercase tracking-[0.25em] text-[#DCC9AA]">
              Interior Design Studio
            </p>

            <p className="mt-2 text-sm leading-6 text-[#F3E7D0]/60">
              Thoughtful spaces designed around the way you live.
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          HERO
      ====================================================== */}

      <section
        id="home"
        className="min-h-screen bg-[#FFF7E8] pt-19"
      >
        <div className="grid min-h-[calc(100vh-76px)] w-full lg:grid-cols-[40%_60%]">
          <div className="relative z-10 flex min-h-[calc(100vh-76px)] items-center overflow-hidden px-6 py-14 sm:px-10 lg:px-10 xl:px-12">
            <Image
              src="/images/home-tour/hero-left-living-room.jpg"
              alt=""
              fill
              priority
              sizes="(max-width: 1023px) 100vw, 40vw"
              className="object-cover object-center"
              aria-hidden="true"
            />

            <div className="absolute inset-0 bg-[#F4E6D0]/18" />
            <div className="absolute inset-0 bg-linear-to-r from-[#FFF7E8]/10 via-transparent to-[#FFF7E8]/24" />

            <div className="relative z-10 w-full max-w-187.5">
              <p className="mb-5 text-[17px] font-bold uppercase tracking-[0.34em] text-[#071A30] sm:text-[20px]">
                Spaces for a better you
              </p>

              <h1 className="text-[#0B1F3A]">
                <span
                  className="block text-[clamp(112px,10.8vw,178px)] font-semibold leading-[0.72] tracking-[-0.045em]"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                  }}
                >
                  Decor
                </span>

                <span
                  className="ml-[28%] mt-1 block text-[clamp(64px,6vw,98px)] font-normal leading-[0.86]"
                  style={{
                    fontFamily: "'Great Vibes', cursive",
                  }}
                >
                  that
                </span>

                <span
                  className="ml-[1%] block text-[clamp(120px,11.2vw,184px)] font-normal leading-[0.65]"
                  style={{
                    fontFamily: "'Great Vibes', cursive",
                  }}
                >
                  Reflects
                </span>

                <span
                  className="ml-[32%] block text-[clamp(116px,10.6vw,176px)] font-normal leading-[0.67]"
                  style={{
                    fontFamily: "'Great Vibes', cursive",
                  }}
                >
                  You
                </span>
              </h1>

              <p className="mt-8 max-w-90 text-[23px] font-bold leading-8 text-[#071A30] sm:text-[26px] sm:leading-9">
                Discover curated spaces and bespoke design made to tell your
                story.
              </p>

              <div className="mt-7">
                <Link
                  href="/designs"
                  className="group inline-flex items-center gap-4 rounded-full bg-[#0B1F3A] px-6 py-3.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#F3E7D0] shadow-[0_12px_30px_rgba(11,31,58,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#274C77] sm:px-7 sm:py-4 sm:text-[10px]"
                >
                  Explore Our Designs
                  <span className="text-base leading-none transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </div>

          <div className="relative min-h-180 overflow-hidden bg-[#E8D6C1] lg:min-h-[calc(100vh-76px)]">
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
              <Image
                src="/images/home-tour/backgrounds/new-bg-3.jpg"
                alt=""
                fill
                sizes="60vw"
                priority
                className="object-cover object-center"
              />

              <div className="absolute inset-0 bg-[#F4E6D4]/18" />
              <div className="absolute inset-0 bg-linear-to-br from-[#FFF7EA]/18 via-transparent to-[#D7B995]/20" />
            </div>

            <div className="absolute inset-0 z-20">
              {homeScenes.map((scene, index) => {
                const position = getRelativePosition(index);
                const isCenter = position === 0;

                let translateY = "0%";
                let scale = "0.74";
                let opacity = "0";
                let zIndex = 1;

                let width = "92%";
                let height = "27%";

                if (position === -2) {
                  translateY = "-132%";
                  opacity = "0";
                  zIndex = 1;
                }

                if (position === -1) {
                  translateY = "-91%";
                  scale = "0.88";
                  opacity = "0.72";
                  zIndex = 10;
                  width = "92%";
                  height = "29%";
                }

                if (position === 0) {
                  translateY = "0%";
                  scale = "1";
                  opacity = "1";
                  zIndex = 30;
                  width = "94%";
                  height = "39%";
                }

                if (position === 1) {
                  translateY = "91%";
                  scale = "0.88";
                  opacity = "0.72";
                  zIndex = 10;
                  width = "92%";
                  height = "29%";
                }

                if (position === 2) {
                  translateY = "132%";
                  opacity = "0";
                  zIndex = 1;
                }

                const cardShape =
                  position === 0
                    ? "46px 82px 82px 46px / 44px 62px 62px 44px"
                    : "38px 72px 72px 38px / 38px 54px 54px 38px";

                return (
                  <div
                    key={scene.id}
                    className="absolute left-1/2 top-1/2 transition-all duration-1400 ease-[cubic-bezier(0.65,0,0.35,1)]"
                    style={{
                      width,
                      height,
                      transform: `translate(-50%, calc(-50% + ${translateY})) scale(${scale})`,
                      zIndex,
                      opacity,
                    }}
                  >
                    <div
                      className="relative flex h-full w-full overflow-hidden border border-[#123754]/35 bg-[#06253B] shadow-[0_22px_55px_rgba(7,31,48,0.24)] transition-all duration-1400"
                      style={{ borderRadius: cardShape }}
                    >
                      <div
                        className="relative h-full w-[48%] shrink-0 overflow-hidden"
                        style={{
                          borderRadius: "inherit",
                        }}
                      >
                        <Image
                          src={scene.image}
                          alt={`${scene.name} interior`}
                          fill
                          sizes="(max-width: 1024px) 48vw, 24vw"
                          priority={index <= 2}
                          unoptimized
                          className={`object-cover object-center transition-transform duration-1800 ease-out ${
                            isCenter ? "scale-105" : "scale-100"
                          }`}
                        />

                        <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-transparent via-transparent to-[#06253B]/10" />
                      </div>

                      <div className="relative flex min-w-0 flex-1 items-center px-5 py-4 sm:px-7 lg:px-8 xl:px-10">
                        <div
                          key={`${scene.id}-${isCenter}`}
                          className="relative w-full animate-[fadeIn_700ms_ease-out]"
                        >
                          <p
                            className="max-w-88 text-[22px] font-semibold leading-[1.16] text-[#F3E7D0] sm:text-[24px] lg:text-[27px] xl:text-[30px]"
                            style={{
                              fontFamily: "'Cormorant Garamond', serif",
                            }}
                          >
                            {scene.subtitle}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          SERVICES
      ====================================================== */}

      <section
  id="services"
  className="scroll-mt-19 border-t border-[#D6C8AF]/50 bg-[#F2E6CC] px-5 py-6 sm:px-8 sm:py-7 lg:px-12 lg:py-8"
>
        <div className="mx-auto max-w-[1600px]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-4xl">
              <h2
                className="text-[2.65rem] font-normal leading-[0.9] tracking-tight text-[#0B1F3A] sm:text-5xl lg:text-[4.25rem]"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                }}
              >
                Design Services{" "}
                <span className="text-[#274C77]">
                  Tailored to Your Lifestyle.
                </span>
              </h2>

              <p className="mt-2.5 max-w-4xl text-sm leading-6 text-[#5B6573] sm:text-[15px] sm:leading-7 lg:whitespace-nowrap">
                From concept to completion, we create thoughtful, functional
                and beautiful spaces that feel like home.
              </p>
            </div>

            <Link
              href="/services"
              className="inline-flex w-fit shrink-0 items-center rounded-full bg-[#274C77] px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#F3E7D0] shadow-[0_8px_22px_rgba(39,76,119,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0B1F3A] sm:px-7 sm:py-3.5"
            >
              Explore Our Services
            </Link>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:mt-5 lg:grid-cols-4">
            {serviceScenes.map((service, cardIndex) => {
              const activeImageIndex =
                activeServiceScenes[cardIndex];

              return (
                <article
                  key={service.name}
                  className="group overflow-hidden bg-[#FFF7E8] shadow-[0_8px_24px_rgba(11,31,58,0.05)]"
                >
                  <div className="relative aspect-[1.12/1] overflow-hidden bg-[#E8D9C0]">
                    {service.images.map((image, imageIndex) => (
                      <Image
                        key={image}
                        src={image}
                        alt={`${service.name} interior design`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className={`object-cover object-center transition-opacity duration-1000 ease-in-out ${
                          imageIndex === activeImageIndex
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                        priority={
                          cardIndex < 2 && imageIndex === 0
                        }
                      />
                    ))}

                    <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#0B1F3A]/10 via-transparent to-transparent" />

                    <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
                      {service.images.map((_, imageIndex) => (
                        <span
                          key={imageIndex}
                          className={`h-1.5 rounded-full transition-all duration-500 ${
                            imageIndex === activeImageIndex
                              ? "w-5 bg-[#FFF7E8]"
                              : "w-1.5 bg-[#FFF7E8]/60"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-4 sm:px-5">
                    <h3
                      className="text-[1.9rem] font-normal leading-none text-[#0B1F3A]"
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                      }}
                    >
                      {service.name}
                    </h3>

                    <p className="mt-2.5 max-w-xs text-[13px] leading-5.5 text-[#5B6573]">
                      {service.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          PROJECTS / PORTFOLIO
          BEFORE → AFTER TRANSFORMATION SHOWCASE
      ====================================================== */}

      <section
        id="portfolio"
        className="scroll-mt-19 bg-[#FFF7E8] px-5 pb-14 pt-8 sm:px-8 sm:pb-16 sm:pt-10 lg:px-12 lg:pb-18 lg:pt-12"
      >
        <div className="mx-auto max-w-[1600px]">
          {/* SECTION INTRO */}
          <div>
            <h2
              className="whitespace-nowrap text-[clamp(2.8rem,5vw,5.5rem)] font-normal leading-[0.86] tracking-[-0.035em] text-[#0B1F3A]"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
              }}
            >
              Spaces transformed{" "}
              <span className="italic text-[#6F8799]">
                with intention.
              </span>
            </h2>
          </div>

          {/* SINGLE FEATURED PROJECT */}
          <div className="mt-6 sm:mt-7 lg:mt-8">
            <StaticProjectShowcase />
          </div>
        </div>
      </section>

      {/* =====================================================
          TESTIMONIALS / REVIEWS
      ====================================================== */}

      <section
        id="reviews"
        className="scroll-mt-19 relative overflow-hidden bg-[#FFF7E8] px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-18"
      >
        {/* Editorial background details */}
        <div
          className="pointer-events-none absolute -left-28 top-16 h-80 w-80 rounded-full bg-[#E6D8B8]/55 blur-[1px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-36 bottom-0 h-105 w-105 rounded-full bg-[#E6D8B8]/50"
          aria-hidden="true"
        />

        <div className="pointer-events-none absolute left-0 top-28 hidden h-64 w-56 lg:block" aria-hidden="true">
          <div className="absolute left-12 top-8 h-48 w-px rotate-22 bg-[#C79B3B]/55" />
          <div className="absolute left-8 top-20 h-20 w-12 rotate-[-28deg] rounded-[100%_0] border border-[#C79B3B]/55" />
          <div className="absolute left-14 top-36 h-24 w-14 rotate-20 rounded-[100%_0] border border-[#C79B3B]/55" />
          <div className="absolute left-4 top-45 h-18 w-11 rotate-[-22deg] rounded-[100%_0] border border-[#C79B3B]/45" />
        </div>

        <div className="pointer-events-none absolute right-0 bottom-10 hidden h-64 w-56 lg:block" aria-hidden="true">
          <div className="absolute right-16 bottom-4 h-52 w-px rotate-[-28deg] bg-[#C79B3B]/55" />
          <div className="absolute right-8 bottom-32 h-24 w-14 rotate-25 rounded-[100%_0] border border-[#C79B3B]/55" />
          <div className="absolute right-18 bottom-20 h-20 w-12 rotate-[-22deg] rounded-[100%_0] border border-[#C79B3B]/50" />
          <div className="absolute right-2 bottom-10 h-18 w-11 rotate-28 rounded-[100%_0] border border-[#C79B3B]/45" />
        </div>

        <div className="relative z-10 mx-auto max-w-375">
          {/* SECTION HEADING */}
          <div className="mx-auto max-w-4xl text-center">
            <div className="flex items-center justify-center gap-5">
              <span className="h-px w-14 bg-[#C79B3B]/60" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.38em] text-[#A77A32]">
                Client Stories
              </p>
              <span className="h-px w-14 bg-[#C79B3B]/60" />
            </div>

            <h2
              className="mt-4 text-[clamp(3rem,5.6vw,5.7rem)] font-normal leading-[0.8] tracking-[-0.04em] text-[#0B1F3A]"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
              }}
            >
              Spaces that speak
              <br />
              <span className="text-[#B2874A]">
                for themselves.
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-[13px] leading-6 text-[#5B6573] sm:text-sm">
              Real homes, real people, real stories of spaces designed with purpose,
              comfort and care.
            </p>
          </div>

          {/* REVIEW CARDS */}
          {testimonials.length === 0 ? (
            <div className="mx-auto mt-9 max-w-2xl rounded-[1.45rem] border border-[#D8C9AF]/65 bg-[#FFFDF8] px-7 py-10 text-center shadow-[0_18px_45px_rgba(11,31,58,0.05)]">
              <p
                className="text-2xl text-[#0B1F3A]"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                }}
              >
                Client stories will appear here soon.
              </p>
            </div>
          ) : (
            <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visibleTestimonials.map((review) => (
              <article
                key={review._id}
                className="group overflow-hidden rounded-[1.45rem] border border-[#D8C9AF]/65 bg-[#FFFDF8] shadow-[0_18px_45px_rgba(11,31,58,0.07)] transition-transform duration-500 hover:-translate-y-1"
              >
                {/* Testimonial image from backend */}
<div className="relative aspect-[1.9/1] overflow-hidden bg-[#E6D8B8]">
  <Image
    src={
      review.imageUrl ||
      "/images/home-tour/01-living-room.jpg"
    }
    alt={`${review.customerName}'s testimonial`}
    fill
    sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
    unoptimized
    className="object-cover transition-transform duration-700 group-hover:scale-[1.035]"
  />

  <div className="absolute inset-0 bg-linear-to-t from-[#0B1F3A]/20 via-transparent to-transparent" />
</div>

                <div className="px-7 pb-7 pt-6 sm:px-8 sm:pb-8">
                  {/* Rating */}
                  <div
                    className="flex items-center gap-1 text-[#B9822F]"
                    aria-label={`${review.rating} out of 5 stars for ${review.customerName}`}
                  >
                    {Array.from({ length: 5 }).map((_, index) => (
                      <span
                        key={index}
                        className={`text-[17px] leading-none ${
                          index < review.rating
                            ? "text-[#B9822F]"
                            : "text-[#DCC9AA]"
                        }`}
                        aria-hidden="true"
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  {/* Quote */}
                  <div className="relative mt-4 pl-8">
                    <span
                      className="absolute -left-1 -top-2 text-5xl leading-none text-[#DCC9AA]"
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                      }}
                      aria-hidden="true"
                    >
                      “
                    </span>

                    <p
                      className="text-[1.18rem] leading-[1.4] text-[#0B1F3A]"
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                      }}
                    >
                      {review.content}
                    </p>
                  </div>

                  <div className="mt-5 h-px w-8 bg-[#C79B3B]" />

                  <div className="mt-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0B1F3A]">
                      {review.customerName}
                    </p>

                    <p className="mt-2 text-[9px] uppercase tracking-[0.17em] text-[#7A7F86]">
                      {review.role || "Client"}
                    </p>
                  </div>
                </div>
              </article>
            ))}
            </div>
          )}

          {/* CAROUSEL CONTROLS / CTA */}
          <div className="mt-7 flex flex-col items-center">
            <div className="flex items-center gap-4">
              <button
                type="button"
                aria-label="Previous reviews"
                disabled={totalTestimonialPages <= 1}
                onClick={() =>
                  setTestimonialPage((current) => {
                    if (totalTestimonialPages <= 1) {
                      return 0;
                    }

                    return current === 0
                      ? totalTestimonialPages - 1
                      : current - 1;
                  })
                }
                className="flex h-12 w-12 items-center justify-center rounded-full border border-[#C79B3B]/70 text-2xl text-[#0B1F3A] transition-all duration-300 hover:-translate-x-0.5 hover:bg-[#0B1F3A] hover:text-[#F3E7D0] disabled:pointer-events-none disabled:opacity-30"
              >
                ‹
              </button>

              <div className="flex items-center gap-2" aria-hidden="true">
                {Array.from({ length: totalTestimonialPages }).map((_, index) => (
                  <span
                    key={index}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      index === testimonialPage ? "w-5 bg-[#0B1F3A]" : "w-2.5 bg-[#DCC9AA]"
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                aria-label="Next reviews"
                disabled={totalTestimonialPages <= 1}
                onClick={() =>
                  setTestimonialPage((current) => {
                    if (totalTestimonialPages <= 1) {
                      return 0;
                    }

                    return current === totalTestimonialPages - 1
                      ? 0
                      : current + 1;
                  })
                }
                className="flex h-12 w-12 items-center justify-center rounded-full border border-[#C79B3B]/70 text-2xl text-[#0B1F3A] transition-all duration-300 hover:translate-x-0.5 hover:bg-[#0B1F3A] hover:text-[#F3E7D0] disabled:pointer-events-none disabled:opacity-30"
              >
                ›
              </button>
            </div>

            
          </div>
        </div>
      </section>

{/* =====================================================
    CONTACT / CONSULTATION
===================================================== */}

<section
  id="contact"
  className="scroll-mt-19 border-t border-[#F3E7D0]/10 bg-[#0B1F3A] text-[#FFF7E8]"
>
  <div className="mx-auto max-w-[1600px] px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-20">

    <div className="grid gap-10 border-b border-[#F3E7D0]/10 pb-12 lg:grid-cols-[1.05fr_0.9fr_1fr] lg:items-end lg:gap-14">

      {/* CONTACT HEADING */}

      <div>
        <div className="mb-5">
  <p className="text-[9px] font-semibold uppercase tracking-[0.32em] text-[#C79B3B]">
    Contact Studio
  </p>
</div>

        <h2
          className="max-w-xl text-5xl font-normal leading-[0.88] tracking-tighter sm:text-6xl lg:text-7xl"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
          }}
        >
          Let&apos;s create
          <br />
          something{" "}
          <span className="italic text-[#DCC9AA]">
            personal.
          </span>
        </h2>
      </div>

      {/* DESCRIPTION + CTA */}

      <div className="lg:pb-1">
        <p className="max-w-md text-sm leading-7 text-[#FFF7E8]/55">
          Have a home, space or project in mind?
          Tell us a little about it and our design
          team will help you take the next step.
        </p>

        <Link
          href="/consultation"
          className="group mt-7 inline-flex items-center gap-5 rounded-full bg-[#F3E7D0] px-6 py-3.5 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#0B1F3A] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white"
        >
          <span>Schedule an Appointment</span>

          <span className="text-sm transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>

      {/* MAP */}

      <div className="group relative h-56 overflow-hidden border border-[#F3E7D0]/15 bg-[#274C77] sm:h-64 lg:h-60">

        {office?.latitude !== undefined &&
        office?.longitude !== undefined ? (
          <>
            <iframe
              title={
                office.name
                  ? `${office.name} location`
                  : "Office location"
              }
              src={`https://www.google.com/maps?q=${office.latitude},${office.longitude}&z=15&output=embed`}
              className="pointer-events-none absolute inset-0 h-full w-full border-0 grayscale-[0.2] opacity-80 transition duration-500 group-hover:opacity-100"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            <div className="pointer-events-none absolute inset-0 bg-[#0B1F3A]/15 transition group-hover:bg-transparent" />

            <div className="absolute left-4 top-4 z-10 bg-[#0B1F3A]/90 px-3 py-2 backdrop-blur-sm">
              <p className="text-[8px] uppercase tracking-[0.22em] text-[#FFF7E8]">
                Studio Location
              </p>
            </div>

            <div className="absolute bottom-4 right-4 z-10">
              <a
                href={`https://www.google.com/maps?q=${office.latitude},${office.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open studio location in Google Maps"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F3E7D0] text-sm text-[#0B1F3A] shadow-lg transition-all duration-300 hover:bg-[#C79B3B] hover:text-white"
              >
                ↗
              </a>
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center">
            <div>
              <p
                className="text-3xl text-[#cdcca1]"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                }}
              >
                Studio location
              </p>

              <p className="mt-2 text-xs text-[#FFF7E8]/50">
                Location information will appear here.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>

  </div>
</section>


{/* =====================================================
    FOOTER
===================================================== */}

<footer className="border-t border-[#F3E7D0]/10 bg-[#0B1F3A] text-[#FFF7E8]">
  <div className="mx-auto max-w-[1600px] px-6 py-12 sm:px-10 lg:px-16 lg:py-14">

    <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.25fr_0.75fr_0.85fr_1fr]">

      {/* BRAND */}

      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-3"
        >
          <span className="flex h-10 w-10 items-center justify-center border border-[#F3E7D0]/35 font-serif text-lg text-[#F3E7D0]">
            I
          </span>

          <div className="text-[10px] uppercase tracking-[0.25em] text-[#F3E7D0]">
            Interior
            <br />
            Studio
          </div>
        </Link>

        <p className="mt-5 max-w-70 text-xs leading-6 text-[#FFF7E8]/35">
          Thoughtfully designed interiors shaped around
          the way you live.
        </p>

        {office?.showSocialHandles &&
          office.socialHandles?.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-4">
              {office.socialHandles
                .slice(0, 4)
                .map((social, index) => (
                  <a
                    key={`${social.platform}-${index}`}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[9px] uppercase tracking-[0.2em] text-[#FFF7E8]/45 transition hover:text-[#DCC9AA]"
                  >
                    {social.platform === "x"
                      ? "X / Twitter"
                      : social.platform}

                    <span className="ml-2">
                      ↗
                    </span>
                  </a>
                ))}
            </div>
          )}
      </div>

      {/* NAVIGATE */}

      <div>
        <p className="text-[9px] uppercase tracking-[0.25em] text-[#FFF7E8]/30">
          Navigate
        </p>

        <div className="mt-5 flex flex-col gap-3">

          <a
            href="#home"
            className="w-fit text-[9px] uppercase tracking-[0.15em] text-[#FFF7E8]/50 transition hover:text-white"
          >
            Home
          </a>

          <Link
            href="/designs"
            className="w-fit text-[9px] uppercase tracking-[0.15em] text-[#FFF7E8]/50 transition hover:text-white"
          >
            Designs
          </Link>

          <a
            href="#services"
            className="w-fit text-[9px] uppercase tracking-[0.15em] text-[#FFF7E8]/50 transition hover:text-white"
          >
            Services
          </a>

          <a
            href="#portfolio"
            className="w-fit text-[9px] uppercase tracking-[0.15em] text-[#FFF7E8]/50 transition hover:text-white"
          >
            Projects
          </a>

          <a
            href="#reviews"
            className="w-fit text-[9px] uppercase tracking-[0.15em] text-[#FFF7E8]/50 transition hover:text-white"
          >
            Reviews
          </a>

          <Link
            href="/about"
            className="w-fit text-[9px] uppercase tracking-[0.15em] text-[#FFF7E8]/50 transition hover:text-white"
          >
            About
          </Link>

          <a
            href="#contact"
            className="w-fit text-[9px] uppercase tracking-[0.15em] text-[#FFF7E8]/50 transition hover:text-white"
          >
            Contact
          </a>

        </div>
      </div>

      {/* SERVICES */}

      <div>
        <p className="text-[9px] uppercase tracking-[0.25em] text-[#FFF7E8]/30">
          Services
        </p>

        <div className="mt-5 flex flex-col gap-3">
          {serviceScenes.map((service) => (
            <a
              key={service.name}
              href="#services"
              className="w-fit text-[9px] uppercase tracking-[0.15em] text-[#FFF7E8]/50 transition hover:text-white"
            >
              {service.name}
            </a>
          ))}
        </div>
      </div>

      {/* REACH US */}

      <div>
        <p className="text-[9px] uppercase tracking-[0.25em] text-[#FFF7E8]/30">
          Reach Us
        </p>

        <div className="mt-5 flex flex-col gap-3 text-xs leading-5 text-[#FFF7E8]/45">

          {office && (
            <>
              {office.latitude !== undefined &&
                office.longitude !== undefined ? (
                <a
                  href={`https://www.google.com/maps?q=${office.latitude},${office.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-white"
                >
                  {office.city}
                  {office.state
                    ? `, ${office.state}`
                    : ""}
                  {office.country
                    ? `, ${office.country}`
                    : ""}
                </a>
              ) : (
                <a
                  href="#contact"
                  className="transition hover:text-white"
                >
                  {office.city}
                  {office.state
                    ? `, ${office.state}`
                    : ""}
                  {office.country
                    ? `, ${office.country}`
                    : ""}
                </a>
              )}

              {office.email && (
                <a
                  href={`mailto:${office.email}`}
                  className="transition hover:text-white"
                >
                  {office.email}
                </a>
              )}

              {office.phone && (
                <a
                  href={`tel:${office.phone}`}
                  className="transition hover:text-white"
                >
                  {office.phone}
                </a>
              )}
            </>
          )}

        </div>

        <Link
          href="/consultation"
          className="mt-6 inline-flex items-center gap-4 rounded-full border border-[#F3E7D0]/20 px-5 py-3 text-[9px] uppercase tracking-[0.2em] text-[#FFF7E8]/65 transition hover:border-[#F3E7D0] hover:bg-[#F3E7D0] hover:text-[#0B1F3A]"
        >
          Schedule Appointment
          <span>→</span>
        </Link>
      </div>

    </div>

    {/* FOOTER BOTTOM */}

    <div className="mt-12 flex flex-col justify-between gap-4 border-t border-[#F3E7D0]/10 pt-5 text-[8px] uppercase tracking-[0.18em] text-[#FFF7E8]/20 sm:flex-row sm:items-center">

      <p>
        © {new Date().getFullYear()} Interior Studio
      </p>

      <div className="flex gap-5">
        <span>
          {office?.city || "Delhi NCR"}
        </span>

        <span>
          {office?.country || "India"}
        </span>
      </div>

      <p>
        Designed with intention.
      </p>

    </div>

  </div>
</footer>

        {/* FLOATING WHATSAPP BUTTON */}
        <a
          href="https://wa.me/918700197668?text=Hi%2C%20I%27m%20interested%20in%20your%20interior%20design%20services.%20I%27d%20like%20to%20know%20more."
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          className="group fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_rgba(11,31,58,0.22)] transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-[0_14px_35px_rgba(11,31,58,0.28)] sm:bottom-7 sm:right-7"
        >
          <svg
            viewBox="0 0 32 32"
            className="h-7 w-7 fill-current"
            aria-hidden="true"
          >
            <path d="M16 2.7C8.67 2.7 2.7 8.67 2.7 16c0 2.35.61 4.56 1.77 6.51L2.62 29.3l6.95-1.82A13.23 13.23 0 0 0 16 29.3c7.33 0 13.3-5.97 13.3-13.3S23.33 2.7 16 2.7Zm0 24.17c-2.1 0-4.16-.56-5.95-1.62l-.43-.25-4.13 1.08 1.1-4.03-.28-.44A10.99 10.99 0 1 1 16 26.87Zm6.03-8.24c-.33-.17-1.96-.97-2.26-1.08-.3-.11-.52-.17-.74.17-.22.33-.85 1.08-1.04 1.3-.19.22-.38.25-.7.08-.33-.17-1.38-.51-2.63-1.63-.97-.87-1.63-1.94-1.82-2.27-.19-.33-.02-.51.14-.68.15-.15.33-.38.49-.57.16-.19.22-.33.33-.55.11-.22.05-.41-.03-.57-.08-.17-.74-1.8-1.01-2.47-.27-.65-.54-.56-.74-.57h-.63c-.22 0-.57.08-.87.41-.3.33-1.14 1.11-1.14 2.72s1.17 3.16 1.33 3.38c.16.22 2.3 3.51 5.57 4.92.78.34 1.39.55 1.86.7.78.25 1.49.22 2.05.13.63-.09 1.96-.8 2.24-1.57.28-.77.28-1.43.19-1.57-.08-.14-.3-.22-.63-.39Z" />
          </svg>

          <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-full bg-[#0B1F3A] px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#FFF7E8] opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100 sm:block">
            Chat on WhatsApp
          </span>
        </a>

    </main>
  );
}

/* ============================================================
   PROJECT SHOWCASE
   Before → After interactive comparison
============================================================ */

type StaticProject = {
  _id: string;
  title: string;
  location: string;
  category: string;
  style: string;
  description: string;
};

function StaticProjectShowcase() {
  const staticProject = {
    _id: "static-project",
    title: "Modern Comfort, Timeless Living",
    location: "Residential",
    category: "Living Room",
    style: "Contemporary",
    description:
      "A thoughtful transformation from an unfinished space into a warm, elegant interior designed for everyday living.",
  };

  return (
    <ProjectComparison
      project={staticProject}
      beforeImage={PROJECT_BEFORE_IMAGE}
      afterImage={PROJECT_AFTER_IMAGE}
    />
  );
}

function ProjectComparison({
  project,
  beforeImage,
  afterImage,
}: {
  project: StaticProject;
  beforeImage: string;
  afterImage: string;
}) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const updateSlider = (
    event: ReactPointerEvent<HTMLDivElement>
  ) => {
    const rect =
      event.currentTarget.getBoundingClientRect();

    if (!rect.width) return;

    const position =
      ((event.clientX - rect.left) / rect.width) * 100;

    setSliderPosition(
      Math.min(100, Math.max(0, position))
    );
  };

  const handlePointerDown = (
    event: ReactPointerEvent<HTMLDivElement>
  ) => {
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    updateSlider(event);
  };

  const handlePointerMove = (
    event: ReactPointerEvent<HTMLDivElement>
  ) => {
    if (!isDragging) return;
    updateSlider(event);
  };

  const handlePointerUp = (
    event: ReactPointerEvent<HTMLDivElement>
  ) => {
    setIsDragging(false);

    if (
      event.currentTarget.hasPointerCapture(
        event.pointerId
      )
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId
      );
    }
  };

  return (
    <article className="grid gap-8 lg:grid-cols-[minmax(0,1.62fr)_minmax(320px,0.78fr)] lg:items-center lg:gap-10 xl:grid-cols-[minmax(0,1.68fr)_minmax(360px,0.76fr)] xl:gap-12">
      {/* BEFORE / AFTER IMAGE */}
      <div
        className={`relative aspect-[1.68/1] w-full touch-none select-none overflow-hidden rounded-3xl border border-[#D6C8AF] bg-[#E6D8B8] shadow-[0_18px_45px_rgba(11,31,58,0.08)] sm:rounded-4xl ${
          isDragging ? "cursor-grabbing" : "cursor-ew-resize"
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* AFTER IMAGE */}
        <Image
          src={afterImage}
          alt={`${project.title} after transformation`}
          fill
          sizes="(max-width: 1024px) 100vw, 68vw"
          className="object-cover object-center"
          priority
        />

        {/* BEFORE IMAGE — STATIC IMAGE, CLIPPED */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
          }}
        >
          <Image
            src={beforeImage}
            alt={`${project.title} before transformation`}
            fill
            sizes="(max-width: 1024px) 100vw, 68vw"
            className="object-cover object-center"
          />
        </div>

        {/* LABELS */}
        <div className="absolute left-5 top-5 z-20 rounded-full bg-[#0B1F3A]/92 px-5 py-2.5 text-[9px] font-semibold uppercase tracking-[0.26em] text-[#FFF7E8] sm:left-7 sm:top-7">
          Before
        </div>

        <div className="absolute right-5 top-5 z-20 rounded-full bg-[#FFF7E8]/95 px-5 py-2.5 text-[9px] font-semibold uppercase tracking-[0.26em] text-[#0B1F3A] shadow-sm sm:right-7 sm:top-7">
          After
        </div>

        {/* BOTTOM IMAGE OVERLAY */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20">
          <div className="absolute inset-x-0 bottom-0 h-44 bg-linear-to-t from-[#0B1F3A]/90 via-[#0B1F3A]/30 to-transparent" />

          <div className="relative px-6 pb-6 pt-16 sm:px-8 sm:pb-8">
            <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#E3C98B]">
              {project.category || "Interior Design"}
            </p>

            <h3
              className="mt-2 max-w-2xl text-[clamp(2rem,3.4vw,3.6rem)] font-normal leading-[0.9] text-[#FFF7E8]"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
              }}
            >
              {project.title}
            </h3>

            <p className="mt-3 max-w-2xl text-xs leading-5.5 text-[#FFF7E8]/75 sm:text-sm">
              {project.description}
            </p>
          </div>
        </div>

        {/* INTERACTIVE DIVIDER */}
        <div
          className="pointer-events-none absolute inset-y-0 z-30"
          style={{
            left: `${sliderPosition}%`,
            transform: "translateX(-50%)",
          }}
        >
          <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[#FFF7E8] shadow-[0_0_10px_rgba(11,31,58,0.24)]" />

          {/* Actual draggable handle */}
          <button
            type="button"
            aria-label="Drag to compare before and after"
            className={`pointer-events-auto absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 touch-none cursor-ew-resize items-center justify-center rounded-full border border-[#FFF7E8] bg-[#FFF7E8] text-[#0B1F3A] shadow-[0_8px_24px_rgba(11,31,58,0.22)] transition-transform sm:h-16 sm:w-16 ${
              isDragging ? "scale-110 cursor-grabbing" : ""
            }`}
            onPointerDown={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setIsDragging(true);
              event.currentTarget.setPointerCapture(
                event.pointerId
              );
            }}
            onPointerMove={(event) => {
              if (!isDragging) return;
              const parent =
                event.currentTarget.parentElement?.parentElement;

              if (!parent) return;

              const rect = parent.getBoundingClientRect();
              const position =
                ((event.clientX - rect.left) / rect.width) *
                100;

              setSliderPosition(
                Math.min(100, Math.max(0, position))
              );
            }}
            onPointerUp={(event) => {
              setIsDragging(false);

              if (
                event.currentTarget.hasPointerCapture(
                  event.pointerId
                )
              ) {
                event.currentTarget.releasePointerCapture(
                  event.pointerId
                );
              }
            }}
            onPointerCancel={() => {
              setIsDragging(false);
            }}
          >
            <span className="text-xl leading-none">
              ‹›
            </span>
          </button>
        </div>

        <div className="pointer-events-none absolute bottom-5 left-1/2 z-30 -translate-x-1/2 rounded-full bg-[#0B1F3A]/70 px-4 py-2 text-[8px] font-semibold uppercase tracking-[0.22em] text-[#FFF7E8] backdrop-blur-md">
          Drag to compare
        </div>
      </div>

      {/* PROJECT INFORMATION */}
      <div className="flex h-full flex-col justify-center">
        <h3
          className="mt-0 max-w-lg text-[clamp(2.6rem,4vw,4.2rem)] font-normal leading-[0.88] tracking-[-0.02em] text-[#0B1F3A]"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
          }}
        >
          {project.title}
        </h3>

        <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 text-[#5B6573]">
          {project.location && (
            <span className="text-[10px] uppercase tracking-[0.16em]">
              {project.location}
            </span>
          )}

          {project.location && project.category && (
            <span className="text-[#C79B3B]">|</span>
          )}

          {project.category && (
            <span className="text-[10px] uppercase tracking-[0.16em]">
              {project.category}
            </span>
          )}

          {project.style && (
            <>
              <span className="text-[#C79B3B]">|</span>
              <span className="text-[10px] uppercase tracking-[0.16em]">
                {project.style}
              </span>
            </>
          )}
        </div>

        <div className="mt-7 h-px w-full bg-[#D6C8AF]" />

        <p className="mt-7 max-w-xl text-sm leading-7 text-[#5B6573] sm:text-[15px]">
          {project.description}
        </p>

        <Link
          href="/projects"
          className="group mt-7 inline-flex w-fit items-center gap-5 rounded-full bg-[#274C77] px-7 py-3.5 text-[9px] font-bold uppercase tracking-[0.22em] text-[#F3E7D0] shadow-[0_8px_22px_rgba(39,76,119,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0B1F3A]"
        >
          Explore All Projects
          <span className="text-base leading-none transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </article>
  );
}

