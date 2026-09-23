"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  publicConsultationApi,
  type CreateConsultationPayload,
} from "@/lib/api";

export default function ConsultationPage() {
  const [formData, setFormData] =
  useState<CreateConsultationPayload>({
    name: "",
    phone: "",
    email: "",
    consultationType: "phone",
    preferredDate: "",
    preferredTime: "",
    location: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(
    field: keyof CreateConsultationPayload,
    value: string
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    setSuccessMessage("");
    setErrorMessage("");
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const payload: CreateConsultationPayload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email?.trim() || undefined,
        consultationType: formData.consultationType,
      };

      if (formData.preferredDate?.trim()) {
        payload.preferredDate =
          formData.preferredDate;
      }

      if (formData.preferredTime?.trim()) {
        payload.preferredTime =
          formData.preferredTime;
      }

      if (formData.location?.trim()) {
        payload.location =
          formData.location.trim();
      }

      if (formData.message?.trim()) {
        payload.message =
          formData.message.trim();
      }

      await publicConsultationApi.createConsultation(
        payload
      );

      setSuccessMessage(
        "Your consultation request has been submitted successfully. We will contact you soon."
      );

      setFormData({
        name: "",
        phone: "",
        consultationType: "phone",
        preferredDate: "",
        preferredTime: "",
        location: "",
        message: "",
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to submit consultation request."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#faf9f6] text-[#24231f]">
      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5 sm:px-8">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight"
          >
            Studio
            <span className="text-[#9a7653]">.</span>
          </Link>

          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-[#9a7653]"
          >
            Back to home
          </Link>
        </div>
      </header>

      <section className="px-5 py-14 sm:px-8 md:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#9a7653]">
              Design consultation
            </p>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Let&apos;s discuss your space.
            </h1>

            <p className="mx-auto mt-5 max-w-2xl leading-7 text-gray-600">
              Tell us a little about what you are
              looking for and we&apos;ll get back to you
              to discuss the next steps.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-10"
          >
            <div className="grid gap-6">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium"
                >
                  Name
                </label>

                <input
                  id="name"
                  type="text"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={(event) =>
                    handleChange(
                      "name",
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm outline-none placeholder:text-gray-400 focus:border-[#9a7653]"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-medium"
                >
                  Phone number
                </label>

                <input
                  id="phone"
                  type="tel"
                  placeholder="Your phone number"
                  value={formData.phone}
                  onChange={(event) =>
                    handleChange(
                      "phone",
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm outline-none placeholder:text-gray-400 focus:border-[#9a7653]"
                  required
                />
              </div>

                {/* Email */}
                <div>
  <label
    htmlFor="email"
    className="mb-2 block text-sm font-medium"
  >
    Email address
  </label>

  <input
    id="email"
    type="email"
    placeholder="you@example.com"
    value={formData.email ?? ""}
    onChange={(event) =>
      handleChange(
        "email",
        event.target.value
      )
    }
    className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm outline-none placeholder:text-gray-400 focus:border-[#9a7653]"
  />
</div>

              {/* Consultation Type */}
              <div>
                <label
                  htmlFor="consultationType"
                  className="mb-2 block text-sm font-medium"
                >
                  Consultation type
                </label>

                <select
                  id="consultationType"
                  value={formData.consultationType}
                  onChange={(event) =>
                    handleChange(
                      "consultationType",
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:border-[#9a7653]"
                  required
                >
                  <option value="phone">
                    Phone
                  </option>

                  <option value="online">
                    Online
                  </option>

                  <option value="site_visit">
                    Site Visit
                  </option>
                </select>
              </div>

              {/* Preferred Date & Time */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="preferredDate"
                    className="mb-2 block text-sm font-medium"
                  >
                    Preferred date
                  </label>

                  <input
                    id="preferredDate"
                    type="date"
                    value={formData.preferredDate}
                    onChange={(event) =>
                      handleChange(
                        "preferredDate",
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:border-[#9a7653]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="preferredTime"
                    className="mb-2 block text-sm font-medium"
                  >
                    Preferred time
                  </label>

                  <input
                    id="preferredTime"
                    type="text"
                    placeholder="e.g. 11:00 AM"
                    value={formData.preferredTime}
                    onChange={(event) =>
                      handleChange(
                        "preferredTime",
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm outline-none placeholder:text-gray-400 focus:border-[#9a7653]"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label
                  htmlFor="location"
                  className="mb-2 block text-sm font-medium"
                >
                  Location
                </label>

                <input
                  id="location"
                  type="text"
                  placeholder="City or site location"
                  value={formData.location}
                  onChange={(event) =>
                    handleChange(
                      "location",
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm outline-none placeholder:text-gray-400 focus:border-[#9a7653]"
                />
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium"
                >
                  Tell us about your project
                </label>

                <textarea
                  id="message"
                  rows={6}
                  placeholder="Tell us about your space, requirements, or what you would like help with..."
                  value={formData.message}
                  onChange={(event) =>
                    handleChange(
                      "message",
                      event.target.value
                    )
                  }
                  className="w-full resize-none rounded-xl border border-black/15 bg-white px-4 py-3 text-sm outline-none placeholder:text-gray-400 focus:border-[#9a7653]"
                />
              </div>

              {/* Success Message */}
              {successMessage && (
                <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  {successMessage}
                </div>
              )}

              {/* Error Message */}
              {errorMessage && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-[#292820] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#9a7653] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Submitting..."
                  : "Request consultation"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

