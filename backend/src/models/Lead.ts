import { Schema, model, type Document } from "mongoose";

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "converted"
  | "closed";

export type LeadSource =
  | "website"
  | "whatsapp"
  | "phone"
  | "referral"
  | "other";

export interface ILead extends Document {
  name: string;
  phone: string;
  email?: string;
  city?: string;
  message?: string;
  service?: string;
  budget?: string;
  source: LeadSource;
  status: LeadStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new Schema<ILead>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 150,
    },

    city: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    message: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    service: {
      type: String,
      trim: true,
      maxlength: 150,
    },

    budget: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    source: {
      type: String,
      enum: [
        "website",
        "whatsapp",
        "phone",
        "referral",
        "other",
      ],
      default: "website",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: [
        "new",
        "contacted",
        "qualified",
        "converted",
        "closed",
      ],
      default: "new",
      required: true,
      index: true,
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 5000,
    },
  },
  {
    timestamps: true,
    collection: "leads",
  }
);

const Lead = model<ILead>("Lead", leadSchema);

export default Lead;