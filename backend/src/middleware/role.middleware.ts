import { Response, NextFunction } from "express";
import {
  AuthenticatedRequest,
} from "./auth.middleware";
import { ApiError } from "../utils/api-error";

type UserRole = "customer" | "designer" | "admin";

export const requireRole = (...allowedRoles: UserRole[]) => {
  return (
    req: AuthenticatedRequest,
    _res: Response,
    next: NextFunction
  ): void => {
    if (!req.user) {
      return next(
        new ApiError(401, "Authentication required")
      );
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          "You do not have permission to access this resource"
        )
      );
    }

    next();
  };
};