import "dotenv/config";

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

function optionalEnv(name, fallback) {
  const value = process.env[name];
  if (value == null || value === "") return fallback;
  return value;
}

function parsePort(raw) {
  const port = Number(raw);
  if (!Number.isInteger(port) || port <= 0) {
    throw new Error(`Invalid PORT: ${raw}`);
  }
  return port;
}

export const env = {
  PORT: parsePort(optionalEnv("PORT", "8787")),
  CLIENT_ORIGIN: optionalEnv("CLIENT_ORIGIN", "http://localhost:3000"),
  SUPABASE_URL: requireEnv("SUPABASE_URL"),
  SUPABASE_SERVICE_ROLE_KEY: requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
  DATABASE_URL_POOLER: requireEnv("DATABASE_URL_POOLER"),
  DATABASE_URL_DIRECT: requireEnv("DATABASE_URL_DIRECT"),
  OPENAI_API_KEY: requireEnv("OPENAI_API_KEY"),
  OPENAI_MODEL: optionalEnv("OPENAI_MODEL", "gpt-4o-mini"),
  OPENAI_EMBED_MODEL: optionalEnv("OPENAI_EMBED_MODEL", "text-embedding-3-small"),
  LEAD_ALERT_EMAIL: optionalEnv("LEAD_ALERT_EMAIL", ""),
  SMTP_HOST: optionalEnv("SMTP_HOST", ""),
  SMTP_PORT: optionalEnv("SMTP_PORT", "587"),
  SMTP_USER: optionalEnv("SMTP_USER", ""),
  SMTP_PASS: optionalEnv("SMTP_PASS", ""),
  EMAIL_FROM: optionalEnv("EMAIL_FROM", ""),
};
