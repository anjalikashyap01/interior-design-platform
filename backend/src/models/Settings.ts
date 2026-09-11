import { Schema, model, type Document } from "mongoose";

export interface ISettings extends Document {
  businessName: string;
  businessEmail?: string;
  businessPhone?: string;
  whatsappNumber?: string;
  address?: string;
  city?: string;
  description?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const settingsSchema = new Schema<ISettings>(
  {
    businessName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    businessEmail: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 150,
    },

    businessPhone: {
      type: String,
      trim: true,
      maxlength: 30,
    },

    whatsappNumber: {
      type: String,
      trim: true,
      maxlength: 30,
    },

    address: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    city: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    instagramUrl: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    facebookUrl: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    linkedinUrl: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    websiteUrl: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
    collection: "settings",
  }
);

const Settings = model<ISettings>("Settings", settingsSchema);

export default Settings;