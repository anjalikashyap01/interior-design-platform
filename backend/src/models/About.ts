import { Schema, model, type Document } from "mongoose";

export interface IAboutImage {
  url: string;
  publicId: string;
  alt?: string;
}

export interface IAboutProcessStep {
  number: string;
  title: string;
  description?: string;
}

export interface IAboutMaterial {
  name: string;
  image?: IAboutImage;
}

export type AboutBrandRelationship =
  | "used"
  | "preferred-supplier"
  | "certified-partner"
  | "official-partner"
  | "other";

export interface IAboutBrand {
  name: string;
  logo?: IAboutImage;
  category?: string;
  website?: string;
  relationship: AboutBrandRelationship;
  description?: string;
  visible: boolean;
}

export interface IAboutTrustPoint {
  title: string;
  description: string;
}

export interface IAboutFounderHighlight {
  value: string;
  label: string;
}

export interface IAbout extends Document {
  hero: {
    heading: string;
    description: string;
    images: IAboutImage[];
  };

  story: {
    heading: string;
    content: string;
    image?: IAboutImage;
  };

  designPhilosophy: {
    heading: string;
    content: string;
  };

  founder: {
    name: string;
    role: string;
    bio: string;
    photo?: IAboutImage;
    highlights: IAboutFounderHighlight[];
  };

  processSteps: IAboutProcessStep[];

  materials: IAboutMaterial[];

  trustedBrands: IAboutBrand[];

  trustPoints: IAboutTrustPoint[];

  cta: {
    heading: string;
    description: string;
    buttonText: string;
    backgroundImage?: IAboutImage;
  };

  createdAt: Date;
  updatedAt: Date;
}

const aboutImageSchema = new Schema<IAboutImage>(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },

    publicId: {
      type: String,
      required: true,
      trim: true,
    },

    alt: {
      type: String,
      trim: true,
      maxlength: 200,
    },
  },
  { _id: false }
);

const processStepSchema = new Schema<IAboutProcessStep>(
  {
    number: {
      type: String,
      required: true,
      trim: true,
      maxlength: 10,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  { _id: false }
);

const materialSchema = new Schema<IAboutMaterial>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    image: {
      type: aboutImageSchema,
    },
  },
  { _id: false }
);

const aboutBrandSchema = new Schema<IAboutBrand>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    logo: {
      type: aboutImageSchema,
    },

    category: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    website: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    relationship: {
      type: String,
      enum: [
        "used",
        "preferred-supplier",
        "certified-partner",
        "official-partner",
        "other",
      ],
      default: "used",
      required: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    visible: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

const trustPointSchema = new Schema<IAboutTrustPoint>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
  },
  { _id: false }
);

const founderHighlightSchema =
  new Schema<IAboutFounderHighlight>(
    {
      value: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50,
      },

      label: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
      },
    },
    { _id: false }
  );

const aboutSchema = new Schema<IAbout>(
  {
    hero: {
      heading: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200,
      },

      description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000,
      },

      images: {
        type: [aboutImageSchema],
        default: [],
        validate: {
          validator: (images: IAboutImage[]) =>
            images.length <= 5,
          message:
            "A maximum of 5 hero images are allowed",
        },
      },
    },

    story: {
      heading: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200,
      },

      content: {
        type: String,
        required: true,
        trim: true,
        maxlength: 3000,
      },

      image: {
        type: aboutImageSchema,
      },
    },

    designPhilosophy: {
      heading: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200,
      },

      content: {
        type: String,
        required: true,
        trim: true,
        maxlength: 3000,
      },
    },

    founder: {
      name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 150,
      },

      role: {
        type: String,
        required: true,
        trim: true,
        maxlength: 150,
      },

      bio: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000,
      },

      photo: {
        type: aboutImageSchema,
      },

      highlights: {
        type: [founderHighlightSchema],
        default: [],
        validate: {
          validator: (
            highlights: IAboutFounderHighlight[]
          ) => highlights.length <= 6,
          message:
            "A maximum of 6 founder highlights are allowed",
        },
      },
    },

    processSteps: {
      type: [processStepSchema],
      default: [],
      validate: {
        validator: (steps: IAboutProcessStep[]) =>
          steps.length <= 5,
        message:
          "A maximum of 5 process steps are allowed",
      },
    },

    materials: {
      type: [materialSchema],
      default: [],
      validate: {
        validator: (materials: IAboutMaterial[]) =>
          materials.length <= 20,
        message:
          "A maximum of 20 materials are allowed",
      },
    },

    trustedBrands: {
      type: [aboutBrandSchema],
      default: [],
      validate: {
        validator: (brands: IAboutBrand[]) =>
          brands.length <= 20,
        message:
          "A maximum of 20 trusted brands are allowed",
      },
    },

    trustPoints: {
      type: [trustPointSchema],
      default: [],
      validate: {
        validator: (points: IAboutTrustPoint[]) =>
          points.length <= 8,
        message:
          "A maximum of 8 trust points are allowed",
      },
    },

    cta: {
      heading: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200,
      },

      description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000,
      },

      buttonText: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
      },

      backgroundImage: {
        type: aboutImageSchema,
      },
    },
  },
  {
    timestamps: true,
    collection: "about",
  }
);

const About = model<IAbout>("About", aboutSchema);

export default About;