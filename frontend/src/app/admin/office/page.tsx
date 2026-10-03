"use client";

import { useCallback, useEffect, useState } from "react";
import {
  adminOfficeApi,
  type Office,
  type OfficeHours,
  type OfficePayload,
  type OfficeSocialHandle,
} from "@/lib/api";

const DAYS = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
] as const;

const SOCIAL_PLATFORMS = [
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "pinterest", label: "Pinterest" },
  { value: "youtube", label: "YouTube" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "x", label: "X / Twitter" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "threads", label: "Threads" },
  { value: "behance", label: "Behance" },
  { value: "dribbble", label: "Dribbble" },
  { value: "other", label: "Other" },
] as const;

const MAX_SOCIAL_HANDLES = 10;

type DayKey = (typeof DAYS)[number]["key"];
type OfficeForm = OfficePayload;

const defaultHours: OfficeHours = {
  open: "09:00",
  close: "18:00",
  closed: false,
};

const createDefaultSocialHandle = (): OfficeSocialHandle => ({
  platform: "instagram",
  url: "",
});

const createDefaultForm = (): OfficeForm => ({
  name: "",
  address: "",
  city: "",
  state: "",
  country: "India",
  phone: "",
  email: "",
  latitude: undefined,
  longitude: undefined,
  showSocialHandles: false,
  socialHandles: [],
  workingHours: {
    monday: { ...defaultHours },
    tuesday: { ...defaultHours },
    wednesday: { ...defaultHours },
    thursday: { ...defaultHours },
    friday: { ...defaultHours },
    saturday: {
      open: "10:00",
      close: "16:00",
      closed: false,
    },
    sunday: {
      open: "09:00",
      close: "18:00",
      closed: true,
    },
  },
});

export default function AdminOfficePage() {
  const [form, setForm] = useState<OfficeForm>(createDefaultForm);
  const [officeExists, setOfficeExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadOffice = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const office: Office = await adminOfficeApi.getOffice();

      setOfficeExists(true);

      setForm({
        name: office.name,
        address: office.address,
        city: office.city,
        state: office.state,
        country: office.country,
        phone: office.phone ?? "",
        email: office.email ?? "",
        latitude: office.latitude,
        longitude: office.longitude,
        showSocialHandles: office.showSocialHandles ?? false,
        socialHandles: Array.isArray(office.socialHandles)
          ? office.socialHandles.map((handle) => ({
              platform: handle.platform,
              url: handle.url,
            }))
          : [],
        workingHours: {
          monday: { ...office.workingHours.monday },
          tuesday: { ...office.workingHours.tuesday },
          wednesday: { ...office.workingHours.wednesday },
          thursday: { ...office.workingHours.thursday },
          friday: { ...office.workingHours.friday },
          saturday: { ...office.workingHours.saturday },
          sunday: { ...office.workingHours.sunday },
        },
      });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to load office information";

      if (message.toLowerCase().includes("not found")) {
        setOfficeExists(false);
        setError("");
        setForm(createDefaultForm());
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadOffice();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadOffice]);

  const updateField = (
    field: keyof Omit<
      OfficeForm,
      "workingHours" | "showSocialHandles" | "socialHandles"
    >,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const updateNumberField = (
    field: "latitude" | "longitude",
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value === "" ? undefined : Number(value),
    }));
  };

  const updateHours = (
    day: DayKey,
    field: keyof OfficeHours,
    value: string | boolean
  ) => {
    setForm((current) => ({
      ...current,
      workingHours: {
        ...current.workingHours,
        [day]: {
          ...current.workingHours[day],
          [field]: value,
        },
      },
    }));
  };

  const updateSocialVisibility = (value: boolean) => {
    setForm((current) => ({
      ...current,
      showSocialHandles: value,
    }));
  };

  const updateSocialHandle = (
    index: number,
    field: keyof OfficeSocialHandle,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      socialHandles: current.socialHandles.map(
        (handle, handleIndex) =>
          handleIndex === index
            ? {
                ...handle,
                [field]: value,
              }
            : handle
      ),
    }));
  };

  const addSocialHandle = () => {
    setForm((current) => {
      if (current.socialHandles.length >= MAX_SOCIAL_HANDLES) {
        return current;
      }

      return {
        ...current,
        socialHandles: [
          ...current.socialHandles,
          createDefaultSocialHandle(),
        ],
      };
    });
  };

  const removeSocialHandle = (index: number) => {
    setForm((current) => ({
      ...current,
      socialHandles: current.socialHandles.filter(
        (_, handleIndex) => handleIndex !== index
      ),
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload: OfficePayload = {
        ...form,
        latitude:
          form.latitude === undefined ||
          Number.isNaN(form.latitude)
            ? undefined
            : form.latitude,
        longitude:
          form.longitude === undefined ||
          Number.isNaN(form.longitude)
            ? undefined
            : form.longitude,
      };

      const savedOffice = officeExists
        ? await adminOfficeApi.updateOffice(payload)
        : await adminOfficeApi.createOffice(payload);

      setOfficeExists(true);

      setForm({
        name: savedOffice.name,
        address: savedOffice.address,
        city: savedOffice.city,
        state: savedOffice.state,
        country: savedOffice.country,
        phone: savedOffice.phone ?? "",
        email: savedOffice.email ?? "",
        latitude: savedOffice.latitude,
        longitude: savedOffice.longitude,
        showSocialHandles:
          savedOffice.showSocialHandles ?? false,
        socialHandles: Array.isArray(
          savedOffice.socialHandles
        )
          ? savedOffice.socialHandles.map((handle) => ({
              platform: handle.platform,
              url: handle.url,
            }))
          : [],
        workingHours: {
          monday: { ...savedOffice.workingHours.monday },
          tuesday: { ...savedOffice.workingHours.tuesday },
          wednesday: { ...savedOffice.workingHours.wednesday },
          thursday: { ...savedOffice.workingHours.thursday },
          friday: { ...savedOffice.workingHours.friday },
          saturday: { ...savedOffice.workingHours.saturday },
          sunday: { ...savedOffice.workingHours.sunday },
        },
      });

      setSuccess(
        officeExists
          ? "Office information updated successfully."
          : "Office information created successfully."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save office information"
      );
    } finally {
      setSaving(false);
    }
  };

  const hasValidCoordinates =
    form.latitude !== undefined &&
    form.longitude !== undefined &&
    !Number.isNaN(form.latitude) &&
    !Number.isNaN(form.longitude);

  const googleMapsUrl = hasValidCoordinates
    ? `https://www.google.com/maps/search/?api=1&query=${form.latitude},${form.longitude}`
    : "";

  const googleDirectionsUrl = hasValidCoordinates
    ? `https://www.google.com/maps/dir/?api=1&destination=${form.latitude},${form.longitude}`
    : "";

  const googleEmbedUrl = hasValidCoordinates
    ? `https://www.google.com/maps?q=${form.latitude},${form.longitude}&z=16&output=embed`
    : "";

  if (loading) {
    return (
      <main className="p-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-8">
          <p className="text-sm text-gray-500">
            Loading office information...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Office
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your office address, contact information, map
            location, social handles, and working hours.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Office Information */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Office Information
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Office Name
                </label>

                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={(event) =>
                    updateField("name", event.target.value)
                  }
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
                  placeholder="Interior Design Studio"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="address"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Address
                </label>

                <textarea
                  id="address"
                  value={form.address}
                  onChange={(event) =>
                    updateField("address", event.target.value)
                  }
                  required
                  rows={3}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
                  placeholder="Complete office address"
                />
              </div>

              <div>
                <label
                  htmlFor="city"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  City
                </label>

                <input
                  id="city"
                  type="text"
                  value={form.city}
                  onChange={(event) =>
                    updateField("city", event.target.value)
                  }
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
                />
              </div>

              <div>
                <label
                  htmlFor="state"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  State
                </label>

                <input
                  id="state"
                  type="text"
                  value={form.state}
                  onChange={(event) =>
                    updateField("state", event.target.value)
                  }
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
                />
              </div>

              <div>
                <label
                  htmlFor="country"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Country
                </label>

                <input
                  id="country"
                  type="text"
                  value={form.country}
                  onChange={(event) =>
                    updateField("country", event.target.value)
                  }
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Phone
                </label>

                <input
                  id="phone"
                  type="tel"
                  value={form.phone ?? ""}
                  onChange={(event) =>
                    updateField("phone", event.target.value)
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  value={form.email ?? ""}
                  onChange={(event) =>
                    updateField("email", event.target.value)
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
                />
              </div>
            </div>
          </section>

          {/* Map Location */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Office Location
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Set the exact coordinates of your office. The map
                  below shows the saved location.
                </p>
              </div>

              {hasValidCoordinates && (
                <div className="flex flex-wrap gap-2">
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-800 transition hover:bg-gray-100"
                  >
                    Open in Google Maps
                  </a>

                  <a
                    href={googleDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
                  >
                    Get Directions
                  </a>
                </div>
              )}
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="latitude"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Latitude
                </label>

                <input
                  id="latitude"
                  type="number"
                  step="any"
                  min="-90"
                  max="90"
                  value={form.latitude ?? ""}
                  onChange={(event) =>
                    updateNumberField(
                      "latitude",
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
                  placeholder="28.4744"
                />
              </div>

              <div>
                <label
                  htmlFor="longitude"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Longitude
                </label>

                <input
                  id="longitude"
                  type="number"
                  step="any"
                  min="-180"
                  max="180"
                  value={form.longitude ?? ""}
                  onChange={(event) =>
                    updateNumberField(
                      "longitude",
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
                  placeholder="77.5040"
                />
              </div>
            </div>

            {/* Interactive Google Maps Preview */}
            <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
              {hasValidCoordinates ? (
                <iframe
                  title="Interactive office location map"
                  src={googleEmbedUrl}
                  className="h-105 w-full border-0"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div className="flex h-105 items-center justify-center px-6 text-center">
                  <div>
                    <p className="font-medium text-gray-700">
                      Map location not set
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                      Enter valid latitude and longitude coordinates
                      to display the office location.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {hasValidCoordinates && (
              <p className="mt-3 text-xs text-gray-500">
                The map shows the current coordinates. Use{" "}
                <span className="font-medium">
                  Open in Google Maps
                </span>{" "}
                for the full Google Maps experience or{" "}
                <span className="font-medium">
                  Get Directions
                </span>{" "}
                for navigation.
              </p>
            )}
          </section>

          {/* Social Handles */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Social Handles
                </h2>

                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Add the social profiles you want to display on the
                  public website. You can add up to 10 handles.
                </p>
              </div>

              <span className="inline-flex w-fit items-center rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600">
                {form.socialHandles.length}/{MAX_SOCIAL_HANDLES}
              </span>
            </div>

            {/* Visibility Toggle */}
            <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Show social handles on website
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Turn this off if you want to temporarily hide all
                  social profiles without deleting them.
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={form.showSocialHandles}
                onClick={() =>
                  updateSocialVisibility(
                    !form.showSocialHandles
                  )
                }
                className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-200 ${
                  form.showSocialHandles
                    ? "bg-gray-900"
                    : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    form.showSocialHandles
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Handles */}
            <div className="mt-6 space-y-4">
              {form.socialHandles.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-8 text-center">
                  <p className="text-sm font-medium text-gray-700">
                    No social handles added yet
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Add your Instagram, YouTube, Pinterest, or other
                    social profiles.
                  </p>
                </div>
              ) : (
                form.socialHandles.map((handle, index) => (
                  <div
                    key={`${handle.platform}-${index}`}
                    className="rounded-2xl border border-gray-200 bg-white p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-semibold text-gray-900">
                        Social Handle {index + 1}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          removeSocialHandle(index)
                        }
                        className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-[220px_1fr]">
                      <div>
                        <label
                          htmlFor={`social-platform-${index}`}
                          className="mb-2 block text-xs font-medium text-gray-500"
                        >
                          Platform
                        </label>

                        <select
                          id={`social-platform-${index}`}
                          value={handle.platform}
                          onChange={(event) =>
                            updateSocialHandle(
                              index,
                              "platform",
                              event.target.value
                            )
                          }
                          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-900"
                        >
                          {SOCIAL_PLATFORMS.map(
                            (platform) => (
                              <option
                                key={platform.value}
                                value={platform.value}
                              >
                                {platform.label}
                              </option>
                            )
                          )}
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor={`social-url-${index}`}
                          className="mb-2 block text-xs font-medium text-gray-500"
                        >
                          Profile URL
                        </label>

                        <input
                          id={`social-url-${index}`}
                          type="url"
                          value={handle.url}
                          onChange={(event) =>
                            updateSocialHandle(
                              index,
                              "url",
                              event.target.value
                            )
                          }
                          placeholder="https://instagram.com/yourstudio"
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add Handle */}
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-gray-500">
                {form.socialHandles.length >=
                MAX_SOCIAL_HANDLES
                  ? "You have reached the maximum of 10 social handles."
                  : `${MAX_SOCIAL_HANDLES - form.socialHandles.length} handle${
                      MAX_SOCIAL_HANDLES -
                        form.socialHandles.length ===
                      1
                        ? ""
                        : "s"
                    } remaining.`}
              </p>

              <button
                type="button"
                onClick={addSocialHandle}
                disabled={
                  form.socialHandles.length >=
                  MAX_SOCIAL_HANDLES
                }
                className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-800 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                + Add Social Handle
              </button>
            </div>
          </section>

          {/* Working Hours */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Working Hours
            </h2>

            <div className="mt-5 space-y-4">
              {DAYS.map((day) => {
                const hours = form.workingHours[day.key];

                return (
                  <div
                    key={day.key}
                    className="grid gap-4 rounded-xl border border-gray-200 p-4 md:grid-cols-[140px_1fr_1fr_auto] md:items-end"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {day.label}
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor={`${day.key}-open`}
                        className="mb-2 block text-xs font-medium text-gray-500"
                      >
                        Opens
                      </label>

                      <input
                        id={`${day.key}-open`}
                        type="time"
                        value={hours.open}
                        disabled={hours.closed}
                        onChange={(event) =>
                          updateHours(
                            day.key,
                            "open",
                            event.target.value
                          )
                        }
                        className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm disabled:bg-gray-100"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`${day.key}-close`}
                        className="mb-2 block text-xs font-medium text-gray-500"
                      >
                        Closes
                      </label>

                      <input
                        id={`${day.key}-close`}
                        type="time"
                        value={hours.close}
                        disabled={hours.closed}
                        onChange={(event) =>
                          updateHours(
                            day.key,
                            "close",
                            event.target.value
                          )
                        }
                        className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm disabled:bg-gray-100"
                      />
                    </div>

                    <label className="flex items-center gap-2 pb-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={hours.closed}
                        onChange={(event) =>
                          updateHours(
                            day.key,
                            "closed",
                            event.target.checked
                          )
                        }
                        className="h-4 w-4"
                      />

                      Closed
                    </label>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Save */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-gray-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : officeExists
                  ? "Save Changes"
                  : "Create Office"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}