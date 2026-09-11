import { Schema, model, type Document } from "mongoose";

export type DesignStatus = "draft" | "published";

export type DesignStyle =
  | "modern"
  | "minimal"
  | "contemporary"
  | "traditional"
  | "industrial"
  | "luxury"
  | "bohemian"
  | "scandinavian"
  | "other";

export interface IDesign extends Document {
  name: string;
  slug: string;
  description: string;
  style: DesignStyle;
  roomTypes: string[];
  colorPalette: string[];
  materials: string[];
  budgetRange?: string;
  image: string;
  images: string[];
  status: DesignStatus;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const designSchema = new Schema<IDesign>(
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

    style: {
      type: String,
      enum: [
        "modern",
        "minimal",
        "contemporary",
        "traditional",
        "industrial",
        "luxury",
        "bohemian",
        "scandinavian",
        "other",
      ],
      default: "modern",
      required: true,
      index: true,
    },

    roomTypes: {
      type: [String],
      required: true,
      default: [],
      index: true,
    },

    colorPalette: {
      type: [String],
      default: [],
    },

    materials: {
      type: [String],
      default: [],
    },

    budgetRange: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    image: {
      type: String,
      required: true,
      trim: true,
    },

    images: {
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
    collection: "designs",
  }
);

const Design = model<IDesign>("Design", designSchema);

export default Design;