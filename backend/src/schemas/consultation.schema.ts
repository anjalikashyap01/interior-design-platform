import { z } from "zod";

const consultationTypeSchema = z.enum([
  "online",
  "phone",
  "site_visit",
]);

const consultationStatusSchema = z.preprocess(
  (value) => {
    if (typeof value === "string") {
      return value.trim().toLowerCase();
    }

    return value;
  },
  z.enum([
    "pending",
    "contacted",
    "confirmed",
    "completed",
    "cancelled",
  ])
);

export const createConsultationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less"),

  phone: z
    .string()
    .trim()
    .min(1, "Phone is required")
    .max(30, "Phone must be 30 characters or less"),

  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .max(150, "Email must be 150 characters or less")
    .optional(),

  city: z
    .string()
    .trim()
    .max(100, "City must be 100 characters or less")
    .optional(),

  consultationType: consultationTypeSchema,

  preferredDate: z.coerce.date().optional(),

  preferredTime: z
    .string()
    .trim()
    .max(50, "Preferred time must be 50 characters or less")
    .optional(),

  message: z
    .string()
    .trim()
    .max(2000, "Message must be 2000 characters or less")
    .optional(),
});

export const updateConsultationSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Name cannot be empty")
      .max(100)
      .optional(),

    phone: z
      .string()
      .trim()
      .min(1, "Phone cannot be empty")
      .max(30)
      .optional(),

    email: z
      .string()
      .trim()
      .email("Invalid email address")
      .max(150)
      .nullable()
      .optional(),

    city: z
      .string()
      .trim()
      .max(100)
      .nullable()
      .optional(),

    consultationType: consultationTypeSchema.optional(),

    preferredDate: z.coerce.date().nullable().optional(),

    preferredTime: z
      .string()
      .trim()
      .max(50)
      .nullable()
      .optional(),

    message: z
      .string()
      .trim()
      .max(2000)
      .nullable()
      .optional(),

    status: consultationStatusSchema.optional(),

    adminNotes: z
      .string()
      .trim()
      .max(5000)
      .nullable()
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export const consultationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(20),

  status: consultationStatusSchema.optional(),

  consultationType: consultationTypeSchema.optional(),
});

export type CreateConsultationInput = z.infer<
  typeof createConsultationSchema
>;

export type UpdateConsultationInput = z.infer<
  typeof updateConsultationSchema
>;

export type ConsultationQueryInput = z.infer<
  typeof consultationQuerySchema
>;