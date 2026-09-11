import { Schema, model, type Document } from "mongoose";

export type GalleryStatus = "draft" | "published";

export interface IGallery extends Document {
  title: string;
  description?: string;
  image: string;
  category?: string;
  projectId?: Schema.Types.ObjectId;
  status: GalleryStatus;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const gallerySchema = new Schema<IGallery>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    image: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      trim: true,
      index: true,
    },

    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      index: true,
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
    collection: "gallery",
  }
);

const Gallery = model<IGallery>("Gallery", gallerySchema);

export default Gallery;