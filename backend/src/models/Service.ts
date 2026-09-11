import { Schema, model, type Document } from "mongoose";

export type ServiceStatus = "draft" | "published";

export interface IService extends Document {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  image?: string;
  startingPrice?: number;
  features: string[];
  status: ServiceStatus;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },

    shortDescription: {
      type: String,
      trim: true,
      maxlength: 300,
    },

    image: {
      type: String,
      trim: true,
    },

    startingPrice: {
      type: Number,
      min: 0,
    },

    features: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      required: true,
      index: true,
    },

    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: "services",
  }
);

const Service = model<IService>("Service", serviceSchema);

export default Service;