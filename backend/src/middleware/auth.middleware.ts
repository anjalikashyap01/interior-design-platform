import { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";

import User from "../models/User";
import { ApiError } from "../utils/api-error";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    clerkUserId: string;
    name?: string;
    email?: string;
    role: "customer" | "designer" | "admin";
    status: "active" | "inactive" | "suspended";
    isActive: boolean;
    isVerified: boolean;
  };
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { isAuthenticated, userId } = getAuth(req);

    if (!isAuthenticated || !userId) {
      throw new ApiError(401, "Authentication required");
    }

    const user = await User.findOne({
      clerkUserId: userId,
    });

    if (!user) {
      throw new ApiError(
        404,
        "User profile not found"
      );
    }

    if (!user.isActive) {
      throw new ApiError(
        403,
        "User account is inactive"
      );
    }

    if (user.status !== "active") {
      throw new ApiError(
        403,
        "User account is not active"
      );
    }

    req.user = {
      id: user._id.toString(),
      clerkUserId: user.clerkUserId,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      isActive: user.isActive,
      isVerified: user.isVerified,
    };

    next();
  } catch (error) {
    next(
      error instanceof ApiError
        ? error
        : new ApiError(
            401,
            "Authentication failed"
          )
    );
  }
};