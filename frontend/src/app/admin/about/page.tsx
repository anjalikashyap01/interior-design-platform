"use client";

import AboutImageUploader from "./AboutImageUploader";
import { useCallback, useEffect, useState } from "react";

import {
  adminAboutApi,
  type About,
  type AboutBrand,
  type AboutMaterial,
  type AboutProcessStep,
  type AboutTrustPoint,
  type AboutFounderHighlight,
} from "@/lib/api";

const emptyAbout: Omit<
  About,
  "_id" | "createdAt" | "updatedAt"
> = {
  hero: {
    heading: "",
    description: "",
    images: [],
  },

  story: {
    heading: "",
    content: "",
  },

  designPhilosophy: {
    heading: "",
    content: "",
  },

  founder: {
    name: "",
    role: "",
    bio: "",
    highlights: [],
  },

  processSteps: [],

  materials: [],

  trustedBrands: [],

  trustPoints: [],

  cta: {
    heading: "",
    description: "",
    buttonText: "",
  },
};

export default function AdminAboutPage() {
  const [about, setAbout] = useState<
    Omit<About, "_id" | "createdAt" | "updatedAt">
  >(emptyAbout);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* =========================================================
     LOAD ABOUT
  ========================================================= */

  const loadAbout = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await adminAboutApi.getAbout();

      setAbout({
        hero: result.hero,
        story: result.story,
        designPhilosophy: result.designPhilosophy,
        founder: result.founder,
        processSteps: result.processSteps ?? [],
        materials: result.materials ?? [],
        trustedBrands: result.trustedBrands ?? [],
        trustPoints: result.trustPoints ?? [],
        cta: result.cta,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load About information"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadAbout();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadAbout]);

  /* =========================================================
     SAVE ABOUT
  ========================================================= */

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const updated = await adminAboutApi.updateAbout(about);

      setAbout({
        hero: updated.hero,
        story: updated.story,
        designPhilosophy: updated.designPhilosophy,
        founder: updated.founder,
        processSteps: updated.processSteps ?? [],
        materials: updated.materials ?? [],
        trustedBrands: updated.trustedBrands ?? [],
        trustPoints: updated.trustPoints ?? [],
        cta: updated.cta,
      });

      setSuccess(
        "About information saved successfully."
      );

      window.setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save About information"
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     HERO
  ========================================================= */

  const updateHero = (
    field: "heading" | "description",
    value: string
  ) => {
    setAbout((current) => ({
      ...current,
      hero: {
        ...current.hero,
        [field]: value,
      },
    }));
  };

  /* =========================================================
     STORY
  ========================================================= */

  const updateStory = (
    field: "heading" | "content",
    value: string
  ) => {
    setAbout((current) => ({
      ...current,
      story: {
        ...current.story,
        [field]: value,
      },
    }));
  };

  /* =========================================================
     DESIGN PHILOSOPHY
  ========================================================= */

  const updateDesignPhilosophy = (
    field: "heading" | "content",
    value: string
  ) => {
    setAbout((current) => ({
      ...current,
      designPhilosophy: {
        ...current.designPhilosophy,
        [field]: value,
      },
    }));
  };

  /* =========================================================
     FOUNDER
  ========================================================= */

  const updateFounder = (
    field: "name" | "role" | "bio",
    value: string
  ) => {
    setAbout((current) => ({
      ...current,
      founder: {
        ...current.founder,
        [field]: value,
      },
    }));
  };

  const addFounderHighlight = () => {
    if (about.founder.highlights.length >= 6) {
      return;
    }

    const highlight: AboutFounderHighlight = {
      value: "",
      label: "",
    };

    setAbout((current) => ({
      ...current,
      founder: {
        ...current.founder,
        highlights: [
          ...current.founder.highlights,
          highlight,
        ],
      },
    }));
  };

  const updateFounderHighlight = (
    index: number,
    field: keyof AboutFounderHighlight,
    value: string
  ) => {
    setAbout((current) => ({
      ...current,
      founder: {
        ...current.founder,
        highlights: current.founder.highlights.map(
          (highlight, highlightIndex) =>
            highlightIndex === index
              ? {
                  ...highlight,
                  [field]: value,
                }
              : highlight
        ),
      },
    }));
  };

  const removeFounderHighlight = (index: number) => {
    setAbout((current) => ({
      ...current,
      founder: {
        ...current.founder,
        highlights:
          current.founder.highlights.filter(
            (_, highlightIndex) =>
              highlightIndex !== index
          ),
      },
    }));
  };

  /* =========================================================
     PROCESS
  ========================================================= */

  const addProcessStep = () => {
    if (about.processSteps.length >= 5) {
      return;
    }

    const step: AboutProcessStep = {
      number: String(
        about.processSteps.length + 1
      ).padStart(2, "0"),
      title: "",
      description: "",
    };

    setAbout((current) => ({
      ...current,
      processSteps: [
        ...current.processSteps,
        step,
      ],
    }));
  };

  const updateProcessStep = (
    index: number,
    field: keyof AboutProcessStep,
    value: string
  ) => {
    setAbout((current) => ({
      ...current,
      processSteps: current.processSteps.map(
        (step, stepIndex) =>
          stepIndex === index
            ? {
                ...step,
                [field]: value,
              }
            : step
      ),
    }));
  };

  const removeProcessStep = (index: number) => {
    setAbout((current) => ({
      ...current,
      processSteps: current.processSteps.filter(
        (_, stepIndex) => stepIndex !== index
      ),
    }));
  };

  /* =========================================================
     MATERIALS
  ========================================================= */

  const addMaterial = () => {
    if (about.materials.length >= 20) {
      return;
    }

    const material: AboutMaterial = {
      name: "",
    };

    setAbout((current) => ({
      ...current,
      materials: [
        ...current.materials,
        material,
      ],
    }));
  };

  const updateMaterial = (
    index: number,
    value: string
  ) => {
    setAbout((current) => ({
      ...current,
      materials: current.materials.map(
        (material, materialIndex) =>
          materialIndex === index
            ? {
                ...material,
                name: value,
              }
            : material
      ),
    }));
  };

  const removeMaterial = (index: number) => {
    setAbout((current) => ({
      ...current,
      materials: current.materials.filter(
        (_, materialIndex) =>
          materialIndex !== index
      ),
    }));
  };

  /* =========================================================
     TRUSTED BRANDS
  ========================================================= */

  const addBrand = () => {
    if (about.trustedBrands.length >= 20) {
      return;
    }

    const brand: AboutBrand = {
      name: "",
      category: "",
      relationship: "used",
      description: "",
      visible: true,
    };

    setAbout((current) => ({
      ...current,
      trustedBrands: [
        ...current.trustedBrands,
        brand,
      ],
    }));
  };

  const updateBrand = (
    index: number,
    field: keyof AboutBrand,
    value: string | boolean
  ) => {
    setAbout((current) => ({
      ...current,
      trustedBrands:
        current.trustedBrands.map(
          (brand, brandIndex) => {
            if (brandIndex !== index) {
              return brand;
            }

            if (field === "website") {
              return {
                ...brand,
                website:
                  typeof value === "string" &&
                  value.trim()
                    ? value.trim()
                    : undefined,
              };
            }

            return {
              ...brand,
              [field]: value,
            };
          }
        ),
    }));
  };

  const removeBrand = (index: number) => {
    setAbout((current) => ({
      ...current,
      trustedBrands:
        current.trustedBrands.filter(
          (_, brandIndex) =>
            brandIndex !== index
        ),
    }));
  };

  /* =========================================================
     TRUST POINTS
  ========================================================= */

  const addTrustPoint = () => {
    if (about.trustPoints.length >= 8) {
      return;
    }

    const point: AboutTrustPoint = {
      title: "",
      description: "",
    };

    setAbout((current) => ({
      ...current,
      trustPoints: [
        ...current.trustPoints,
        point,
      ],
    }));
  };

  const updateTrustPoint = (
    index: number,
    field: keyof AboutTrustPoint,
    value: string
  ) => {
    setAbout((current) => ({
      ...current,
      trustPoints: current.trustPoints.map(
        (point, pointIndex) =>
          pointIndex === index
            ? {
                ...point,
                [field]: value,
              }
            : point
      ),
    }));
  };

  const removeTrustPoint = (index: number) => {
    setAbout((current) => ({
      ...current,
      trustPoints: current.trustPoints.filter(
        (_, pointIndex) =>
          pointIndex !== index
      ),
    }));
  };

  /* =========================================================
     CTA
  ========================================================= */

  const updateCta = (
    field:
      | "heading"
      | "description"
      | "buttonText",
    value: string
  ) => {
    setAbout((current) => ({
      ...current,
      cta: {
        ...current.cta,
        [field]: value,
      },
    }));
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl">
        <p className="text-gray-500">
          Loading About information...
        </p>
      </div>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl pb-12">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            About
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage the content displayed on your
            About page.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={saving}
          className="rounded-lg bg-yellow-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-yellow-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div
          role="alert"
          className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {/* =====================================================
          SUCCESS
      ===================================================== */}

      {success && (
        <div
          role="status"
          className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700"
        >
          {success}
        </div>
      )}

      <div className="space-y-6">
        {/* ===================================================
            HERO
        =================================================== */}

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <SectionHeading
            title="Hero"
            description="The first section visitors see on the About page."
          />

          <div className="mt-6 space-y-5">
            <Field
              label="Heading"
              value={about.hero.heading}
              onChange={(value) =>
                updateHero("heading", value)
              }
              placeholder="Designing spaces with meaning."
            />

            <TextArea
              label="Description"
              value={about.hero.description}
              onChange={(value) =>
                updateHero("description", value)
              }
              rows={4}
              placeholder="Introduce your studio and design approach."
            />

            <AboutImageUploader
              label="Hero Images"
              images={about.hero.images}
              multiple
              maxImages={5}
              onImagesChange={(images) =>
                setAbout((current) => ({
                  ...current,
                  hero: {
                    ...current.hero,
                    images,
                  },
                }))
              }
            />
          </div>
        </section>

        {/* ===================================================
            STORY
        =================================================== */}

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <SectionHeading
            title="Our Story"
            description="Tell visitors about the studio and its approach."
          />

          <div className="mt-6 space-y-5">
            <Field
              label="Heading"
              value={about.story.heading}
              onChange={(value) =>
                updateStory("heading", value)
              }
              placeholder="Thoughtful design for everyday living."
            />

            <TextArea
              label="Content"
              value={about.story.content}
              onChange={(value) =>
                updateStory("content", value)
              }
              rows={7}
              placeholder="Tell your studio story..."
            />

            <AboutImageUploader
              label="Story Image"
              images={
                about.story.image
                  ? [about.story.image]
                  : []
              }
              maxImages={1}
              onImagesChange={(images) =>
                setAbout((current) => ({
                  ...current,
                  story: {
                    ...current.story,
                    image: images[0],
                  },
                }))
              }
            />
          </div>
        </section>

        {/* ===================================================
            DESIGN PHILOSOPHY
        =================================================== */}

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <SectionHeading
            title="Design Philosophy"
            description="Explain the principles behind your design work."
          />

          <div className="mt-6 space-y-5">
            <Field
              label="Heading"
              value={about.designPhilosophy.heading}
              onChange={(value) =>
                updateDesignPhilosophy(
                  "heading",
                  value
                )
              }
              placeholder="Design that feels considered."
            />

            <TextArea
              label="Content"
              value={about.designPhilosophy.content}
              onChange={(value) =>
                updateDesignPhilosophy(
                  "content",
                  value
                )
              }
              rows={7}
              placeholder="Describe your design philosophy..."
            />
          </div>
        </section>

        {/* ===================================================
            FOUNDER
        =================================================== */}

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <SectionHeading
            title="Founder / Designer"
            description="Introduce the person behind the studio."
          />

          <div className="mt-6 space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Name"
                value={about.founder.name}
                onChange={(value) =>
                  updateFounder("name", value)
                }
                placeholder="Founder Name"
              />

              <Field
                label="Role"
                value={about.founder.role}
                onChange={(value) =>
                  updateFounder("role", value)
                }
                placeholder="Founder & Interior Designer"
              />
            </div>

            <TextArea
              label="Bio"
              value={about.founder.bio}
              onChange={(value) =>
                updateFounder("bio", value)
              }
              rows={6}
              placeholder="Founder biography..."
            />

            <AboutImageUploader
              label="Founder Photo"
              images={
                about.founder.photo
                  ? [about.founder.photo]
                  : []
              }
              maxImages={1}
              onImagesChange={(images) =>
                setAbout((current) => ({
                  ...current,
                  founder: {
                    ...current.founder,
                    photo: images[0],
                  },
                }))
              }
            />

            <div>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Highlights
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    Add short facts such as experience,
                    projects or cities served.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addFounderHighlight}
                  disabled={
                    about.founder.highlights.length >= 6
                  }
                  className="rounded-md border border-gray-300 px-3 py-2 text-xs font-medium transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  + Add Highlight
                </button>
              </div>

              <div className="space-y-3">
                {about.founder.highlights.map(
                  (highlight, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-gray-200 p-4"
                    >
                      <div className="grid gap-4 md:grid-cols-[180px_1fr_auto]">
                        <Field
                          label="Value"
                          value={highlight.value}
                          onChange={(value) =>
                            updateFounderHighlight(
                              index,
                              "value",
                              value
                            )
                          }
                          placeholder="10+"
                        />

                        <Field
                          label="Label"
                          value={highlight.label}
                          onChange={(value) =>
                            updateFounderHighlight(
                              index,
                              "label",
                              value
                            )
                          }
                          placeholder="Years of Experience"
                        />

                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={() =>
                              removeFounderHighlight(
                                index
                              )
                            }
                            className="rounded-md border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                )}

                {about.founder.highlights.length === 0 && (
                  <EmptyState text="No founder highlights added yet." />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================
            PROCESS
        =================================================== */}

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <SectionHeading
              title="How We Work"
              description="Manage the steps visitors see in your design process."
            />

            <button
              type="button"
              onClick={addProcessStep}
              disabled={about.processSteps.length >= 5}
              className="rounded-md border border-gray-300 px-3 py-2 text-xs font-medium transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              + Add Step
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {about.processSteps.map(
              (step, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-gray-200 p-5"
                >
                  <div className="grid gap-4 md:grid-cols-[100px_1fr_auto]">
                    <Field
                      label="Number"
                      value={step.number}
                      onChange={(value) =>
                        updateProcessStep(
                          index,
                          "number",
                          value
                        )
                      }
                      placeholder="01"
                    />

                    <Field
                      label="Title"
                      value={step.title}
                      onChange={(value) =>
                        updateProcessStep(
                          index,
                          "title",
                          value
                        )
                      }
                      placeholder="Discover"
                    />

                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() =>
                          removeProcessStep(index)
                        }
                        className="rounded-md border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="mt-4">
                    <TextArea
                      label="Description"
                      value={step.description ?? ""}
                      onChange={(value) =>
                        updateProcessStep(
                          index,
                          "description",
                          value
                        )
                      }
                      rows={3}
                      placeholder="Describe this step..."
                    />
                  </div>
                </div>
              )
            )}

            {about.processSteps.length === 0 && (
              <EmptyState text="No process steps added yet." />
            )}
          </div>
        </section>

        {/* ===================================================
            MATERIALS
        =================================================== */}

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <SectionHeading
              title="Materials & Expertise"
              description="Manage the materials and finishes associated with your work."
            />

            <button
              type="button"
              onClick={addMaterial}
              disabled={about.materials.length >= 20}
              className="rounded-md border border-gray-300 px-3 py-2 text-xs font-medium transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              + Add Material
            </button>
          </div>

          <div className="mt-6 space-y-3">
            {about.materials.map(
              (material, index) => (
                <div
                  key={index}
                  className="flex flex-wrap items-end gap-3 rounded-xl border border-gray-200 p-4"
                >
                  <div className="min-w-60 flex-1">
                    <Field
                      label="Material"
                      value={material.name}
                      onChange={(value) =>
                        updateMaterial(
                          index,
                          value
                        )
                      }
                      placeholder="Natural Wood"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      removeMaterial(index)
                    }
                    className="rounded-md border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              )
            )}

            {about.materials.length === 0 && (
              <EmptyState text="No materials added yet." />
            )}
          </div>
        </section>

        {/* ===================================================
            TRUSTED BRANDS
        =================================================== */}

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <SectionHeading
              title="Trusted Brands"
              description="Manage brands and suppliers associated with your studio."
            />

            <button
              type="button"
              onClick={addBrand}
              disabled={
                about.trustedBrands.length >= 20
              }
              className="rounded-md border border-gray-300 px-3 py-2 text-xs font-medium transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              + Add Brand
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {about.trustedBrands.map(
              (brand, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-gray-200 p-5"
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field
                      label="Brand Name"
                      value={brand.name}
                      onChange={(value) =>
                        updateBrand(
                          index,
                          "name",
                          value
                        )
                      }
                      placeholder="Brand Name"
                    />

                    <Field
                      label="Category"
                      value={brand.category ?? ""}
                      onChange={(value) =>
                        updateBrand(
                          index,
                          "category",
                          value
                        )
                      }
                      placeholder="Lighting"
                    />

                    <SelectField
                      label="Relationship"
                      value={brand.relationship}
                      options={[
                        {
                          value: "used",
                          label: "Used",
                        },
                        {
                          value: "preferred-supplier",
                          label: "Preferred Supplier",
                        },
                        {
                          value: "certified-partner",
                          label: "Certified Partner",
                        },
                        {
                          value: "official-partner",
                          label: "Official Partner",
                        },
                        {
                          value: "other",
                          label: "Other",
                        },
                      ]}
                      onChange={(value) =>
                        updateBrand(
                          index,
                          "relationship",
                          value
                        )
                      }
                    />

                    <Field
                      label="Website"
                      value={brand.website ?? ""}
                      onChange={(value) =>
                        updateBrand(
                          index,
                          "website",
                          value
                        )
                      }
                      placeholder="https://example.com"
                    />
                  </div>

                  <div className="mt-4">
                    <TextArea
                      label="Description"
                      value={brand.description ?? ""}
                      onChange={(value) =>
                        updateBrand(
                          index,
                          "description",
                          value
                        )
                      }
                      rows={3}
                      placeholder="Describe the relationship with this brand..."
                    />
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-4">
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={brand.visible}
                        onChange={(event) =>
                          updateBrand(
                            index,
                            "visible",
                            event.target.checked
                          )
                        }
                        className="h-4 w-4 rounded border-gray-300"
                      />

                      Visible on public page
                    </label>

                    <button
                      type="button"
                      onClick={() =>
                        removeBrand(index)
                      }
                      className="rounded-md border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
                    >
                      Remove Brand
                    </button>
                  </div>

                  {/* BRAND LOGO */}

                  <div className="mt-4">
                    <AboutImageUploader
                      label={`Brand Logo — ${
                        brand.name ||
                        `Brand ${index + 1}`
                      }`}
                      images={
                        brand.logo
                          ? [brand.logo]
                          : []
                      }
                      maxImages={1}
                      onImagesChange={(images) =>
                        setAbout((current) => ({
                          ...current,
                          trustedBrands:
                            current.trustedBrands.map(
                              (
                                currentBrand,
                                brandIndex
                              ) =>
                                brandIndex === index
                                  ? {
                                      ...currentBrand,
                                      logo: images[0],
                                    }
                                  : currentBrand
                            ),
                        }))
                      }
                    />
                  </div>
                </div>
              )
            )}

            {about.trustedBrands.length === 0 && (
              <EmptyState text="No trusted brands added yet." />
            )}
          </div>
        </section>

        {/* ===================================================
            TRUST POINTS
        =================================================== */}

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <SectionHeading
              title="Why Work With Us"
              description="Manage the trust points shown on the About page."
            />

            <button
              type="button"
              onClick={addTrustPoint}
              disabled={
                about.trustPoints.length >= 8
              }
              className="rounded-md border border-gray-300 px-3 py-2 text-xs font-medium transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              + Add Point
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {about.trustPoints.map(
              (point, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-gray-200 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <Field
                        label="Title"
                        value={point.title}
                        onChange={(value) =>
                          updateTrustPoint(
                            index,
                            "title",
                            value
                          )
                        }
                        placeholder="Personalized Design"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        removeTrustPoint(index)
                      }
                      className="mt-6 rounded-md border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="mt-4">
                    <TextArea
                      label="Description"
                      value={point.description}
                      onChange={(value) =>
                        updateTrustPoint(
                          index,
                          "description",
                          value
                        )
                      }
                      rows={3}
                      placeholder="Explain this trust point..."
                    />
                  </div>
                </div>
              )
            )}

            {about.trustPoints.length === 0 && (
              <EmptyState text="No trust points added yet." />
            )}
          </div>
        </section>

        {/* ===================================================
            CTA
        =================================================== */}

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <SectionHeading
            title="Final CTA"
            description="Manage the final consultation call-to-action."
          />

          <div className="mt-6 space-y-5">
            <Field
              label="Heading"
              value={about.cta.heading}
              onChange={(value) =>
                updateCta("heading", value)
              }
              placeholder="Your space could be next."
            />

            <TextArea
              label="Description"
              value={about.cta.description}
              onChange={(value) =>
                updateCta(
                  "description",
                  value
                )
              }
              rows={4}
              placeholder="Invite visitors to start a conversation."
            />

            <Field
              label="Button Text"
              value={about.cta.buttonText}
              onChange={(value) =>
                updateCta(
                  "buttonText",
                  value
                )
              }
              placeholder="Book a Consultation"
            />

            {/* CTA BACKGROUND IMAGE */}

            <AboutImageUploader
              label="CTA Background Image"
              images={
                about.cta.backgroundImage
                  ? [about.cta.backgroundImage]
                  : []
              }
              maxImages={1}
              onImagesChange={(images) =>
                setAbout((current) => ({
                  ...current,
                  cta: {
                    ...current.cta,
                    backgroundImage: images[0],
                  },
                }))
              }
            />
          </div>
        </section>

        {/* ===================================================
            BOTTOM SAVE
        =================================================== */}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={saving}
            className="rounded-lg bg-yellow-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-yellow-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : "Save About Changes"}
          </button>
        </div>
      </div>
    </main>
  );
}

/* =========================================================
   REUSABLE UI
========================================================= */

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900">
        {title}
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        {description}
      </p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 5,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <textarea
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: {
    value: string;
    label: string;
  }[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function EmptyState({
  text,
}: {
  text: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-500">
      {text}
    </div>
  );
}