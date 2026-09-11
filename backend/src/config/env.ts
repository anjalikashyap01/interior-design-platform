import dotenv from "dotenv";

dotenv.config();

const env = {
  nodeEnv: process.env.NODE_ENV || "development",

  port: Number(process.env.PORT) || 5000,

  mongodbUri: process.env.MONGODB_URI || "",

  jwtSecret: process.env.JWT_SECRET || "",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",

  adminJwtSecret: process.env.ADMIN_JWT_SECRET || "",
  adminJwtExpiresIn: process.env.ADMIN_JWT_EXPIRES_IN || "1d",

  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    apiKey: process.env.CLOUDINARY_API_KEY || "",
    apiSecret: process.env.CLOUDINARY_API_SECRET || "",
  },

  otp: {
    provider: process.env.OTP_PROVIDER || "msg91",
    msg91AuthKey: process.env.MSG91_AUTH_KEY || "",
    msg91TemplateId: process.env.MSG91_TEMPLATE_ID || "",
  },

  ai: {
    provider: process.env.AI_PROVIDER || "",
    apiKey: process.env.AI_API_KEY || "",
  },

  email: {
    provider: process.env.EMAIL_PROVIDER || "resend",
    apiKey: process.env.EMAIL_API_KEY || "",
  },

  business: {
    name: process.env.BUSINESS_NAME || "",
    email: process.env.BUSINESS_EMAIL || "",
    whatsapp: process.env.BUSINESS_WHATSAPP || "",
  },
};

export default env;