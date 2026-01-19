import express from "express";
import { corsMiddleware } from "./middleware/cors.js";
import { apiRateLimit } from "./middleware/rateLimit.js";
import { chatRouter } from "./routes/chat.js";
import { healthRouter } from "./routes/health.js";
import { leadsRouter } from "./routes/leads.js";

export function createApp() {
  const app = express();

  app.use(express.json({ limit: "1mb" }));

  app.use(corsMiddleware);

  app.use(apiRateLimit);
  app.use("/api", healthRouter);

  app.use(chatRouter);
  app.use(leadsRouter);

  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ ok: false, error: "Server error" });
  });

  return app;
}
