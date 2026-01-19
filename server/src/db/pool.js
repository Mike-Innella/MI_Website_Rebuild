import pg from "pg";
import { env } from "../config/env.js";
import dns from "node:dns";

const { Pool } = pg;

if (typeof dns.setDefaultResultOrder === "function") {
  dns.setDefaultResultOrder("ipv4first");
}

function stripSslParams(connectionString) {
  try {
    const url = new URL(connectionString);
    url.searchParams.delete("sslmode");
    url.searchParams.delete("sslrootcert");
    url.searchParams.delete("sslcert");
    url.searchParams.delete("sslkey");
    url.searchParams.delete("sslpassword");
    url.searchParams.delete("sslcompression");
    url.searchParams.delete("sslsni");
    url.searchParams.delete("requiressl");
    url.searchParams.delete("gssencmode");
    url.searchParams.delete("sslnegotiation");
    url.searchParams.delete("uselibpqcompat");
    return url.toString();
  } catch {
    return connectionString;
  }
}

function getConnectionString(which) {
  if (which === "direct") return env.DATABASE_URL_DIRECT;
  return env.DATABASE_URL_POOLER;
}

export const pool = new Pool({
  connectionString: stripSslParams(getConnectionString("default")),
  ssl: { rejectUnauthorized: false },
  max: 10,
  family: 4,
});

export const ragPool = new Pool({
  connectionString: stripSslParams(getConnectionString("direct")),
  ssl: { rejectUnauthorized: false },
  max: 5,
  family: 4,
});

export async function query(text, params) {
  return pool.query(text, params);
}
