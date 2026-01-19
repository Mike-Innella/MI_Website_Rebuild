import "dotenv/config";
import { spawnSync } from "node:child_process";
import { logEnvPresence, logHeader } from "./_debug.js";

function run(label, args, { optional = false } = {}) {
  console.log(`\n==> ${label}: ${args.join(" ")}`);
  const res = spawnSync(args[0], args.slice(1), {
    stdio: "inherit",
    env: process.env,
  });

  if (res.status === 0) return true;
  if (optional) {
    console.log(`(optional) skipped/failed: ${label} (exit ${res.status ?? "?"})`);
    return false;
  }
  process.exit(res.status ?? 1);
}

const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";

logHeader("test:all");
logEnvPresence([
  "DATABASE_URL_POOLER",
  "DATABASE_URL_DIRECT",
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "OPENAI_API_KEY",
]);

run("DB (pooler)", [npmCmd, "run", "test:db"]);
run("RAG chunks (direct)", [npmCmd, "run", "test:rag"]);
run("RAG docs (HTTPS RPC)", [npmCmd, "run", "test:rag:docs"], { optional: true });

console.log("\n✅ test:all complete");
