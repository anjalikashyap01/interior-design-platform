import { Schema, model, type Document } from "mongoose";

export type TestimonialStatus = "draft" | "published";

export interface ITestimonial extends Document {
  customerName: string;
  customerLocation?: string;
  content: string;
  rating: number;
  customerImage?: string;
  projectId?: Schema.Types.ObjectId;
  status: TestimonialStatus;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const testimonialSchema = new Schema<ITestimonial>(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    customerLocation: {
      type: String,
      trim: true,
      maxlength: 150,
    },

    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    customerImage: {
      type: String,
      trim: true,
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
    collection: "testimonials",
  }
);

const Testimonial = model<ITestimonial>(
  "Testimonial",
  testimonialSchema
);

export default Testimonial;