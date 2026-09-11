import { Schema, model, type Document } from "mongoose";

export type ConsultationStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

export type ConsultationType =
  | "online"
  | "phone"
  | "site_visit";

export interface IConsultation extends Document {
  name: string;
  phone: string;
  email?: string;
  city?: string;
  consultationType: ConsultationType;
  preferredDate?: Date;
  preferredTime?: string;
  message?: string;
  status: ConsultationStatus;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const consultationSchema = new Schema<IConsultation>(
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

    consultationType: {
      type: String,
      enum: ["online", "phone", "site_visit"],
      default: "online",
      required: true,
      index: true,
    },

    preferredDate: {
      type: Date,
    },

    preferredTime: {
      type: String,
      trim: true,
      maxlength: 50,
    },

    message: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "completed",
        "cancelled",
      ],
      default: "pending",
      required: true,
      index: true,
    },

    adminNotes: {
      type: String,
      trim: true,
      maxlength: 5000,
    },
  },
  {
    timestamps: true,
    collection: "consultations",
  }
);

const Consultation = model<IConsultation>(
  "Consultation",
  consultationSchema
);

export default Consultation;