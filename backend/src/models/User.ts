import { Schema, model, type Document } from "mongoose";

export interface IUser extends Document {
  phone: string;
  name?: string;
  email?: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
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