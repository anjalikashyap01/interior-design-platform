import type {
  ErrorRequestHandler,
  Request,
  Response,
  NextFunction,
} from "express";
import { ApiError } from "../utils/api-error";
import env from "../config/env";
import multer from "multer";

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

      if (
    error instanceof Error &&
    error.name === "MongoServerError"
  ) {
    const mongoError = error as Error & {
      code?: number;
    };

    if (mongoError.code === 11000) {
      res.status(409).json({
        success: false,
        message: "A record with this value already exists",
      });

      return;
    }
  }

  if (error instanceof multer.MulterError) {
    res.status(400).json({
      success: false,
      message: "File upload failed",
      details: {
        code: error.code,
        field: error.field,
      },
    });

    return;
  }

  if (
    error instanceof Error &&
    error.message ===
      "Only JPG, PNG and WEBP images are allowed"
  ) {
    res.status(400).json({
      success: false,
      message: error.message,
    });

    return;
  }

  const isProduction =
    process.env.NODE_ENV === "production";

  res.status(500).json({
    success: false,
    message: isProduction
      ? "Internal server error"
      : error instanceof Error
        ? error.message
        : "Internal server error",
    ...(isProduction
      ? {}
      : {
          stack:
            error instanceof Error
              ? error.stack
              : undefined,
        }),
  });

};