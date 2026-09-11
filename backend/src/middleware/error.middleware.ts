import type {
  ErrorRequestHandler,
  Request,
  Response,
  NextFunction,
} from "express";
import { ApiError } from "../utils/api-error";
import env from "../config/env";

export const errorMiddleware: ErrorRequestHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error(error);

  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      ...(error.errors !== undefined
        ? { errors: error.errors }
        : {}),
    });

    return;
  }

  res.status(500).json({
    success: false,
    message:
      env.nodeEnv === "production"
        ? "Internal server error"
        : "Something went wrong",
  });
};