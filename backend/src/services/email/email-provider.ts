import { Resend } from "resend";

const apiKey = process.env.EMAIL_API_KEY;

if (!apiKey) {
  throw new Error(
    "EMAIL_API_KEY is not configured"
  );
}

export const resend = new Resend(apiKey);