import { getAuth } from "@clerk/express";
import type { Request, Response, NextFunction } from "express";

export interface AuthenticatedRequest extends Request {
  authUserId?: string;
}

export const requireClerkAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const { isAuthenticated, userId } = getAuth(req);

  if (!isAuthenticated || !userId) {
    res.status(401).json({
      success: false,
      message: "Authentication required",
    });
    return;
  }

  req.authUserId = userId;
  next();
};