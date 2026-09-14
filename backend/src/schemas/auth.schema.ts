import { z } from "zod";

export const sendOtpSchema = z.object({
  body: z.object({
    phone: z
      .string()
      .trim()
      .regex(
        /^\+91[6-9]\d{9}$/,
        "Please provide a valid Indian phone number"
      ),
  }),

  params: z.object({}),

  query: z.object({}),
});

export const verifyOtpSchema = z.object({
  body: z.object({
    phone: z
      .string()
      .trim()
      .regex(
        /^\+91[6-9]\d{9}$/,
        "Please provide a valid Indian phone number"
      ),

    otp: z
      .string()
      .trim()
      .regex(
        /^\d{4,8}$/,
        "OTP must contain 4 to 8 digits"
      ),
  }),

  params: z.object({}),

  query: z.object({}),
});