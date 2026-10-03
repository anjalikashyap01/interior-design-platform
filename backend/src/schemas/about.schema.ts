import { z } from "zod";

/* =========================================================
   IMAGE
=========================================================*/

const aboutImageSchema = z.object({
  url: z.string().trim().url("Invalid image URL"),

  publicId: z
    .string()
    .trim()
    .min(1, "Image public ID is required"),

  alt: z
    .string()
    .trim()
    .max(200, "Alt text is too long")
    .optional(),
});

/* =========================================================
   PROCESS STEP
=========================================================*/

const processStepSchema = z.object({
  number: z
    .string()
    .trim()
    .min(1, "Step number is required")
    .max(10),

  title: z
    .string()
    .trim()
    .min(1, "Step title is required")
    .max(100),

  description: z
    .string()
    .trim()
    .max(500)
    .optional(),
});

/* =========================================================
   MATERIAL
=========================================================*/

const materialSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Material name is required")
    .max(100),

  image: aboutImageSchema.optional(),
});

/* =========================================================
   TRUSTED BRAND
=========================================================*/

const aboutBrandRelationshipSchema = z.enum([
  "used",
  "preferred-supplier",
  "certified-partner",
  "official-partner",
  "other",
]);

const aboutBrandSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Brand name is required")
    .max(100),

  logo: aboutImageSchema.optional(),

  category: z
    .string()
    .trim()
    .max(100)
    .optional(),

  website: z
    .string()
    .trim()
    .url("Invalid brand website URL")
    .max(500)
    .optional(),

  relationship: aboutBrandRelationshipSchema.default("used"),

  description: z
    .string()
    .trim()
    .max(500)
    .optional(),

  visible: z.boolean().default(true),
});

/* =========================================================
   TRUST POINT
=========================================================*/

const trustPointSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Trust point title is required")
    .max(100),

  description: z
    .string()
    .trim()
    .min(1, "Trust point description is required")
    .max(500),
});

/* =========================================================
   FOUNDER HIGHLIGHT
=========================================================*/

const founderHighlightSchema = z.object({
  value: z
    .string()
    .trim()
    .min(1, "Highlight value is required")
    .max(50),

  label: z
    .string()
    .trim()
    .min(1, "Highlight label is required")
    .max(100),
});

/* =========================================================
   HERO
=========================================================*/

const heroSchema = z.object({
  heading: z
    .string()
    .trim()
    .min(1, "Hero heading is required")
    .max(200),

  description: z
    .string()
    .trim()
    .min(1, "Hero description is required")
    .max(1000),

  images: z
    .array(aboutImageSchema)
    .max(5, "A maximum of 5 hero images are allowed")
    .default([]),
});

/* =========================================================
   STORY
=========================================================*/

const storySchema = z.object({
  heading: z
    .string()
    .trim()
    .min(1, "Story heading is required")
    .max(200),

  content: z
    .string()
    .trim()
    .min(1, "Story content is required")
    .max(3000),

  image: aboutImageSchema.optional(),
});

/* =========================================================
   DESIGN PHILOSOPHY
=========================================================*/

const designPhilosophySchema = z.object({
  heading: z
    .string()
    .trim()
    .min(1, "Design philosophy heading is required")
    .max(200),

  content: z
    .string()
    .trim()
    .min(1, "Design philosophy content is required")
    .max(3000),
});

/* =========================================================
   FOUNDER
=========================================================*/

const founderSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Founder name is required")
    .max(150),

  role: z
    .string()
    .trim()
    .min(1, "Founder role is required")
    .max(150),

  bio: z
    .string()
    .trim()
    .min(1, "Founder bio is required")
    .max(2000),

  photo: aboutImageSchema.optional(),

  highlights: z
    .array(founderHighlightSchema)
    .max(6, "A maximum of 6 founder highlights are allowed")
    .default([]),
});

/* =========================================================
   CTA
=========================================================*/

const ctaSchema = z.object({
  heading: z
    .string()
    .trim()
    .min(1, "CTA heading is required")
    .max(200),

  description: z
    .string()
    .trim()
    .min(1, "CTA description is required")
    .max(1000),

  buttonText: z
    .string()
    .trim()
    .min(1, "CTA button text is required")
    .max(100),

  backgroundImage: aboutImageSchema.optional(),
});

/* =========================================================
   COMPLETE ABOUT SCHEMA
=========================================================*/

export const createAboutSchema = z.object({
  hero: heroSchema,

  story: storySchema,

  designPhilosophy: designPhilosophySchema,

  founder: founderSchema,

  processSteps: z
    .array(processStepSchema)
    .max(5, "A maximum of 5 process steps are allowed")
    .default([]),

  materials: z
    .array(materialSchema)
    .max(20, "A maximum of 20 materials are allowed")
    .default([]),

  trustedBrands: z
    .array(aboutBrandSchema)
    .max(20, "A maximum of 20 trusted brands are allowed")
    .default([]),

  trustPoints: z
    .array(trustPointSchema)
    .max(8, "A maximum of 8 trust points are allowed")
    .default([]),

  cta: ctaSchema,
});

/* =========================================================
   UPDATE
=========================================================*/

export const updateAboutSchema =
  createAboutSchema.partial();

/* =========================================================
   TYPES
=========================================================*/

export type CreateAboutInput =
  z.infer<typeof createAboutSchema>;

export type UpdateAboutInput =
  z.infer<typeof updateAboutSchema>;