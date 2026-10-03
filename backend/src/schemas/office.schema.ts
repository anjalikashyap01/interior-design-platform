import { z } from "zod";

const officeHoursSchema = z.object({
  open: z
    .string()
    .trim()
    .regex(
      /^([01]\d|2[0-3]):([0-5]\d)$/,
      "Opening time must use HH:mm format"
    ),

  close: z
    .string()
    .trim()
    .regex(
      /^([01]\d|2[0-3]):([0-5]\d)$/,
      "Closing time must use HH:mm format"
    ),

  closed: z.boolean(),
});

const socialHandleSchema = z.object({
  platform: z
    .string()
    .trim()
    .min(1, "Social platform is required")
    .max(50, "Social platform is too long"),

  url: z
    .string()
    .trim()
    .url("Invalid social handle URL")
    .max(500, "Social handle URL is too long"),
});

const socialHandlesSchema = z
  .array(socialHandleSchema)
  .max(10, "A maximum of 10 social handles are allowed")
  .default([]);

export const createOfficeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Office name is required")
    .max(150),

  address: z
    .string()
    .trim()
    .min(1, "Address is required")
    .max(500),

  city: z
    .string()
    .trim()
    .min(1, "City is required")
    .max(100),

  state: z
    .string()
    .trim()
    .min(1, "State is required")
    .max(100),

  country: z
    .string()
    .trim()
    .min(1, "Country is required")
    .max(100)
    .default("India"),

  phone: z
    .string()
    .trim()
    .max(30)
    .optional(),

  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .max(150)
    .optional(),

  latitude: z
    .number()
    .min(-90)
    .max(90)
    .optional(),

  longitude: z
    .number()
    .min(-180)
    .max(180)
    .optional(),

  showSocialHandles: z.boolean().default(false),

  socialHandles: socialHandlesSchema,

  workingHours: z.object({
    monday: officeHoursSchema,
    tuesday: officeHoursSchema,
    wednesday: officeHoursSchema,
    thursday: officeHoursSchema,
    friday: officeHoursSchema,
    saturday: officeHoursSchema,
    sunday: officeHoursSchema,
  }),
});

export const updateOfficeSchema =
  createOfficeSchema.partial();

export type CreateOfficeInput = z.infer<
  typeof createOfficeSchema
>;

export type UpdateOfficeInput = z.infer<
  typeof updateOfficeSchema
>;