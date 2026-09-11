import { Schema, model, type Document } from "mongoose";

export type ProjectStatus = "draft" | "published";

export interface IProject extends Document {
  title: string;
  slug: string;
  description: string;
  category: string;
  location?: string;
  budget?: string;
  area?: string;
  coverImage: string;
  images: string[];
  status: ProjectStatus;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    title: {
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

    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    location: {
      type: String,
      trim: true,
      maxlength: 150,
    },

    budget: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    area: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    coverImage: {
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
    collection: "projects",
  }
);

const Project = model<IProject>("Project", projectSchema);

export default Project;