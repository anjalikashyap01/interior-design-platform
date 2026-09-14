import {
  Request,
  Response,
  NextFunction,
} from "express";

import User from "../models/User";
import {
  verifyCustomerToken,
} from "../utils/jwt";
import { ApiError } from "../utils/api-error";

export interface AuthenticatedRequest
  extends Request {
  user?: {
    id: string;
    phone: string;
    name?: string;
    email?: string;
    isVerified: boolean;
  };
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authorization =
      req.headers.authorization;

    if (!authorization) {
      throw new ApiError(
        401,
        "Authentication required"
      );
    }

    const [scheme, token] =
      authorization.split(" ");

    if (
      scheme !== "Bearer" ||
      !token
    ) {
      throw new ApiError(
        401,
        "Invalid authorization header"
      );
    }

    const payload =
      verifyCustomerToken(token);

    const user = await User.findById(
      payload.userId
    ).lean();

    if (!user) {
      throw new ApiError(
        401,
        "User no longer exists"
      );
    }

    if (!user.isVerified) {
      throw new ApiError(
        403,
        "User is not verified"
      );
    }

    req.user = {
      id: user._id.toString(),
      phone: user.phone,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
    };

    next();
  } catch (error) {
    next(
      error instanceof ApiError
        ? error
        : new ApiError(
            401,
            "Invalid or expired authentication token"
          )
    );
  }
};