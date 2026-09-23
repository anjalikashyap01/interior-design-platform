"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Show,
  UserButton,
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";
import {
  publicOfficeApi,
  type Office,
} from "@/lib/api";

export default function HomePage() {
  const [office, setOffice] = useState<Office | null>(null);

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

  return (
    <main className="min-h-screen bg-[#faf9f6] text-[#24231f]">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-black/10 bg-[#faf9f6]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight"
          >
            Studio<span className="text-[#9a7653]">.</span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm md:flex">
            <a href="#home" className="hover:text-[#9a7653]">
              Home
            </a>
            <a href="#services" className="hover:text-[#9a7653]">
              Services
            </a>
            <a href="#portfolio" className="hover:text-[#9a7653]">
              Portfolio
            </a>
            <a href="#about" className="hover:text-[#9a7653]">
              About
            </a>
            <a href="#contact" className="hover:text-[#9a7653]">
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="rounded-full border border-black/20 px-4 py-2 text-sm hover:bg-black hover:text-white">
                  Sign in
                </button>
              </SignInButton>

              <SignUpButton mode="modal">
                <button className="rounded-full bg-[#292820] px-4 py-2 text-sm text-white hover:bg-[#9a7653]">
                  Get started
                </button>
              </SignUpButton>
            </Show>

            <Show when="signed-in">
              <UserButton />
            </Show>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section
        id="home"
        className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 md:grid-cols-2 md:py-28"
      >
        <div>
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-[#9a7653]">
            Thoughtful interiors. Better living.
          </p>

          <h1 className="max-w-xl text-5xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">
            Make room for
            <span className="text-[#9a7653]">
              {" "}beautiful living.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-7 text-gray-600">
            Discover considered interior design for homes
            and spaces that feel personal, comfortable,
            and timeless.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#portfolio"
              className="rounded-full bg-[#292820] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#9a7653]"
            >
              Explore our work
            </a>

            <a
              href="#contact"
              className="rounded-full border border-black/20 px-6 py-3 text-sm font-medium transition hover:bg-black hover:text-white"
            >
              Start a conversation
            </a>
          </div>

          <div className="mt-12 border-t border-black/10 pt-6">
            <p className="text-sm text-gray-500">
              Residential interiors · Space planning ·
              Design consultation
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-4 -top-4 h-full w-full rounded-4xl border border-[#c7b49d] sm:-left-6 sm:-top-6" />

          <div className="relative flex min-h-90 items-end overflow-hidden rounded-4xl bg-linear-to-br from-[#e7dfd3] via-[#c8b8a3] to-[#8d7964] p-8 sm:min-h-125 sm:p-12">
            <div className="absolute right-8 top-8 h-32 w-32 rounded-full border border-white/40 sm:h-48 sm:w-48" />

            <div className="absolute right-16 top-16 h-24 w-24 rounded-full bg-white/20 sm:right-24 sm:top-24 sm:h-36 sm:w-36" />

            <div className="relative max-w-sm rounded-2xl bg-white/80 p-6 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-[#9a7653]">
                Your space, reimagined
              </p>
              <p className="mt-3 text-2xl font-medium leading-snug">
                A thoughtful approach to everyday living.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section
        id="services"
        className="bg-white px-5 py-20 sm:px-8 md:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#9a7653]">
              What we do
            </p>

            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
              Design that works for you.
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              From the first idea to the finishing details,
              create a space that reflects your lifestyle
              and needs.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <article className="rounded-2xl border border-black/10 p-7 transition hover:-translate-y-1 hover:shadow-lg">
              <span className="text-sm text-[#9a7653]">01</span>
              <h3 className="mt-5 text-xl font-semibold">
                Residential Interiors
              </h3>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                Personalised interiors designed around
                your home, routines, and preferences.
              </p>
            </article>

            <article className="rounded-2xl border border-black/10 p-7 transition hover:-translate-y-1 hover:shadow-lg">
              <span className="text-sm text-[#9a7653]">02</span>
              <h3 className="mt-5 text-xl font-semibold">
                Space Planning
              </h3>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                Make thoughtful use of space, movement,
                storage, and natural light.
              </p>
            </article>

            <article className="rounded-2xl border border-black/10 p-7 transition hover:-translate-y-1 hover:shadow-lg">
              <span className="text-sm text-[#9a7653]">03</span>
              <h3 className="mt-5 text-xl font-semibold">
                Design Consultation
              </h3>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                Get guidance on layouts, colours,
                materials, and design direction.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section id="portfolio" className="px-5 py-20 sm:px-8 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#9a7653]">
              Our portfolio
            </p>

            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
              Spaces with a story to tell.
            </h2>

            <p className="mt-5 leading-7 text-gray-600">
              Every project begins with understanding
              how people live and what matters to them.
              Explore ideas and inspiration for your own
              space.
            </p>

            <a
              href="#contact"
              className="mt-7 inline-flex rounded-full border border-black/20 px-6 py-3 text-sm font-medium hover:bg-black hover:text-white"
            >
              Discuss your project
            </a>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex min-h-56 items-end rounded-2xl bg-[#d9cbbb] p-5 sm:min-h-72">
              <span className="text-sm font-medium">
                Warm & natural
              </span>
            </div>

            <div className="mt-10 flex min-h-56 items-end rounded-2xl bg-[#b7b1a4] p-5 sm:min-h-72">
              <span className="text-sm font-medium">
                Calm & minimal
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section
        id="about"
        className="bg-[#eae5dc] px-5 py-20 sm:px-8 md:py-24"
      >
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#9a7653]">
            Our approach
          </p>

          <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
            Good design begins with listening.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl leading-7 text-gray-600">
            Your space should feel like yours. Our
            approach starts with understanding your
            needs, exploring ideas, and bringing the
            details together into a cohesive design.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="px-5 py-20 sm:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl bg-[#292820] px-7 py-14 text-white sm:px-12 sm:py-20">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#d4b995]">
                Let’s get started
              </p>

              <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-semibold sm:text-5xl">
                Have a space in mind?
              </h2>

              <p className="mx-auto mt-5 max-w-xl leading-7 text-white/70">
                Tell us about your ideas and what you would
                like to create.
              </p>

              {office?.email ? (
                <a
                  href={`mailto:${office.email}`}
                  className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-sm font-medium text-[#292820] hover:bg-[#d4b995]"
                >
                  Contact us
                </a>
              ) : (
                <a
                  href="mailto:hello@example.com"
                  className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-sm font-medium text-[#292820] hover:bg-[#d4b995]"
                >
                  Contact us
                </a>
              )}
            </div>

            {office && (
              <div className="mt-12 grid gap-6 border-t border-white/10 pt-10 md:grid-cols-2">
                {/* Office details */}
                <div className="rounded-2xl bg-white/5 p-6 text-left">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4b995]">
                    Visit our office
                  </p>

                  <h3 className="mt-4 text-2xl font-semibold">
                    {office.name}
                  </h3>

                  <p className="mt-4 leading-7 text-white/70">
                    {office.address}
                    <br />
                    {office.city}, {office.state}
                    <br />
                    {office.country}
                  </p>

                  {office.phone && (
                    <a
                      href={`tel:${office.phone}`}
                      className="mt-5 block text-sm text-white hover:text-[#d4b995]"
                    >
                      {office.phone}
                    </a>
                  )}

                  {office.email && (
                    <a
                      href={`mailto:${office.email}`}
                      className="mt-2 block text-sm text-white hover:text-[#d4b995]"
                    >
                      {office.email}
                    </a>
                  )}

                  <div className="mt-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/50">
                      Working hours
                    </p>

                    <div className="mt-3 space-y-1.5 text-sm text-white/70">
                      {[
                        ["Monday", office.workingHours.monday],
                        ["Tuesday", office.workingHours.tuesday],
                        ["Wednesday", office.workingHours.wednesday],
                        ["Thursday", office.workingHours.thursday],
                        ["Friday", office.workingHours.friday],
                        ["Saturday", office.workingHours.saturday],
                        ["Sunday", office.workingHours.sunday],
                      ].map(([day, hours]) => {
                        const dayHours = hours as {
                          open: string;
                          close: string;
                          closed: boolean;
                        };

                        return (
                          <div
                            key={day as string}
                            className="flex justify-between gap-4"
                          >
                            <span>{day as string}</span>
                            <span>
                              {dayHours.closed
                                ? "Closed"
                                : `${dayHours.open} – ${dayHours.close}`}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Map */}
                <div className="overflow-hidden rounded-2xl bg-white/5">
                  {office.latitude !== undefined &&
                  office.longitude !== undefined ? (
                    <iframe
                      title={`${office.name} location`}
                      src={`https://www.google.com/maps?q=${office.latitude},${office.longitude}&z=15&output=embed`}
                      className="h-full min-h-105 w-full border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  ) : (
                    <div className="flex min-h-105 items-center justify-center p-8 text-center text-sm text-white/50">
                      Map location is not available yet.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/10 px-5 py-7 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 text-sm text-gray-500 sm:flex-row">
          <p>
            © {new Date().getFullYear()} Studio. All rights reserved.
          </p>

          <a href="#home" className="hover:text-[#9a7653]">
            Back to top ↑
          </a>
        </div>
      </footer>
    </main>
  );
}