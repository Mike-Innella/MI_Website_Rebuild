import cors from "cors";
import { env } from "../config/env.js";

const allowedOrigins = (env.CLIENT_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const vercelPreviewRegex = /^https:\/\/.*\.vercel\.app$/;

export const corsMiddleware = cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true);
    if (process.env.NODE_ENV !== "production") return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    if (vercelPreviewRegex.test(origin)) return cb(null, true);
    return cb(new Error(`CORS blocked for origin: ${origin}`), false);
  },
  credentials: false,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});
