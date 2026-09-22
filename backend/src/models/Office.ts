import { Schema, model, type Document } from "mongoose";

export interface IOfficeHours {
  open: string;
  close: string;
  closed: boolean;
}

export interface IOffice extends Document {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  phone?: string;
  email?: string;
  latitude?: number;
  longitude?: number;
  workingHours: {
    monday: IOfficeHours;
    tuesday: IOfficeHours;
    wednesday: IOfficeHours;
    thursday: IOfficeHours;
    friday: IOfficeHours;
    saturday: IOfficeHours;
    sunday: IOfficeHours;
  };
  createdAt: Date;
  updatedAt: Date;
}

const officeHoursSchema = new Schema<IOfficeHours>(
  {
    open: {
      type: String,
      trim: true,
      default: "09:00",
    },

    close: {
      type: String,
      trim: true,
      default: "18:00",
    },

    closed: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  }
);

const officeSchema = new Schema<IOffice>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    city: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    state: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    country: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
      default: "India",
    },

    phone: {
      type: String,
      trim: true,
      maxlength: 30,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 150,
    },

    latitude: {
      type: Number,
      min: -90,
      max: 90,
    },

    longitude: {
      type: Number,
      min: -180,
      max: 180,
    },

    workingHours: {
      monday: {
        type: officeHoursSchema,
        default: () => ({}),
      },

      tuesday: {
        type: officeHoursSchema,
        default: () => ({}),
      },

      wednesday: {
        type: officeHoursSchema,
        default: () => ({}),
      },

      thursday: {
        type: officeHoursSchema,
        default: () => ({}),
      },

      friday: {
        type: officeHoursSchema,
        default: () => ({}),
      },

      saturday: {
        type: officeHoursSchema,
        default: () => ({}),
      },

      sunday: {
        type: officeHoursSchema,
        default: () => ({
          closed: true,
        }),
      },
    },
  },
  {
    timestamps: true,
    collection: "office",
  }
);

const Office = model<IOffice>("Office", officeSchema);

export default Office;