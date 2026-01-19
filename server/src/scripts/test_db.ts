import "dotenv/config";
import { pool } from "../db/pool.js";
import { logDbTarget, logEnvPresence, logError, logHeader, time } from "./_debug.js";

logHeader("test:db");
logEnvPresence(["DATABASE_URL_POOLER", "DATABASE_URL_DIRECT", "SUPABASE_URL"]);
logDbTarget("DB TARGET (pooler):", process.env.DATABASE_URL_POOLER);

try {
  const res = await time("query select now()", () => pool.query("select now()"));
  console.log("✅ DB connected:", res.rows[0]);
  await pool.end();
  process.exit(0);
} catch (err) {
  console.error("❌ DB connection failed");
  logError(err, { label: "db error" });
  try {
    await pool.end();
  } catch {
    // ignore
  }
  process.exit(1);
}
