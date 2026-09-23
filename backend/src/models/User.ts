import { Schema, model, type Document } from "mongoose";

export type UserRole = "customer" | "designer" | "admin";

export type UserStatus = "active" | "inactive" | "suspended";

export interface IUser extends Document {
  clerkUserId: string;

  phone?: string;
  name?: string;
  email?: string;

  role: UserRole;
  status: UserStatus;

  isActive: boolean;
  isVerified: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    clerkUserId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    name: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 150,
    },

    role: {
      type: String,
      enum: ["customer", "designer", "admin"],
      default: "customer",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
      required: true,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

const User = model<IUser>("User", userSchema);

export default User;