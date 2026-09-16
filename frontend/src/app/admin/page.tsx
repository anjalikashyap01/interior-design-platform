"use client";

import Link from "next/link";

const cards = [
  {
    title: "Designs",
    description: "Manage your interior design catalog.",
    href: "/admin/designs",
  },
  {
    title: "Projects",
    description: "Manage completed and ongoing projects.",
    href: "/admin/projects",
  },
  {
    title: "Services",
    description: "Manage services offered by the contractor.",
    href: "/admin/services",
  },
  {
    title: "Testimonials",
    description: "Manage customer testimonials.",
    href: "/admin/testimonials",
  },
  {
    title: "Gallery",
    description: "Manage project gallery images.",
    href: "/admin/gallery",
  },
  {
    title: "Leads",
    description: "View customer enquiries and leads.",
    href: "/admin/leads",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      {/* Page Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Dashboard
        </h1>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          Manage your interior design platform from one place.
        </p>
      </div>

      {/* Management Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group flex min-h-44 flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-gray-300 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          >
            {/* Card Heading */}
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {card.title}
              </h2>

              <span
                aria-hidden="true"
                className="text-lg text-gray-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-gray-900"
              >
                →
              </span>
            </div>

            {/* Card Description */}
            <p className="mt-3 flex-1 text-sm leading-6 text-gray-500">
              {card.description}
            </p>

            {/* Card Action */}
            <span className="mt-5 inline-flex items-center text-sm font-semibold text-gray-900">
              Manage
              <span
                aria-hidden="true"
                className="ml-2 transition-transform duration-200 group-hover:translate-x-1"
              >
                →
              </span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}