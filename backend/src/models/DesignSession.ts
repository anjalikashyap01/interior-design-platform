import { Schema, model, type Document } from "mongoose";

export type DesignSessionStatus =
  | "created"
  | "uploaded"
  | "analyzing"
  | "analyzed"
  | "completed"
  | "expired";

export interface IRoomImage {
  url: string;
  publicId: string;
  uploadedAt: Date;
}

export interface IAIAnalysis {
  roomType?: string;
  detectedStyle?: string;
  colors?: string[];
  materials?: string[];
  features?: string[];
  estimatedBudget?: string;
  rawResponse?: unknown;
  analyzedAt?: Date;
}

export interface IRecommendedDesign {
  designId: Schema.Types.ObjectId;
  score: number;
  reason?: string;
}

export interface IDesignSession extends Document {
  userId: Schema.Types.ObjectId;
  status: DesignSessionStatus;
  roomImages: IRoomImage[];
  aiAnalysis?: IAIAnalysis;
  recommendations: IRecommendedDesign[];
  selectedDesignId?: Schema.Types.ObjectId;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const roomImageSchema = new Schema<IRoomImage>(
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

    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  }
);

const aiAnalysisSchema = new Schema<IAIAnalysis>(
  {
    roomType: {
      type: String,
      trim: true,
    },

    detectedStyle: {
      type: String,
      trim: true,
    },

    colors: {
      type: [String],
      default: [],
    },

    materials: {
      type: [String],
      default: [],
    },

    features: {
      type: [String],
      default: [],
    },

    estimatedBudget: {
      type: String,
      trim: true,
    },

    rawResponse: {
      type: Schema.Types.Mixed,
    },

    analyzedAt: {
      type: Date,
    },
  },
  {
    _id: false,
  }
);

const recommendedDesignSchema = new Schema<IRecommendedDesign>(
  {
    designId: {
      type: Schema.Types.ObjectId,
      ref: "Design",
      required: true,
    },

    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    reason: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
  },
  {
    _id: false,
  }
);

const designSessionSchema = new Schema<IDesignSession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: [
        "created",
        "uploaded",
        "analyzing",
        "analyzed",
        "completed",
        "expired",
      ],
      default: "created",
      required: true,
      index: true,
    },

    roomImages: {
      type: [roomImageSchema],
      default: [],
    },

    aiAnalysis: {
      type: aiAnalysisSchema,
    },

    recommendations: {
      type: [recommendedDesignSchema],
      default: [],
    },

    selectedDesignId: {
      type: Schema.Types.ObjectId,
      ref: "Design",
      index: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: "designSessions",
  }
);

designSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const DesignSession = model<IDesignSession>(
  "DesignSession",
  designSessionSchema
);

export default DesignSession;