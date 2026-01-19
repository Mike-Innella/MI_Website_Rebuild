import { Router } from "express";
import { pool } from "../db/pool.js";

export const healthRouter = Router();

healthRouter.get("/health", async (req, res) => {
  await pool.query("select 1 as ok");
  res.json({ ok: true });
});
