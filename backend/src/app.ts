import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import env from "./config/env";
import { notFoundMiddleware } from "./middleware/not-found.middleware";
import { errorMiddleware } from "./middleware/error.middleware";
import apiRoutes from "./routes";
import { clerkMiddleware } from "@clerk/express";

const app = express();

app.disable("x-powered-by");

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

// CORS
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);

app.use(clerkMiddleware());
// Request body parsing
app.use(
  express.json({
    limit: "1mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  })
);

// General rate limiter
const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 200,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

app.use(generalRateLimiter);

// Health check
app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Interior Design Platform API is running",
    environment: env.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

app.use("/api", apiRoutes);
app.use(notFoundMiddleware);

// Global error handler
app.use(errorMiddleware);

export default app;