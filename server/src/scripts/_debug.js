export function maskValue(raw) {
  const v = String(raw ?? "");
  if (!v) return "";
  if (v.length <= 8) return "***";
  return `${v.slice(0, 4)}…${v.slice(-4)}`;
}

export function maskDbUrl(rawUrl) {
  try {
    const u = new URL(String(rawUrl));
    if (u.username) u.username = maskValue(u.username);
    if (u.password) u.password = "***";
    return u.toString();
  } catch {
    return maskValue(rawUrl);
  }
}

export function logHeader(name) {
  console.log(`\n===== ${name} =====`);
  console.log("node:", process.version, "platform:", process.platform, process.arch);
  console.log("pid:", process.pid, "cwd:", process.cwd());
  console.log("time:", new Date().toISOString());
}

export function logEnvPresence(keys) {
  const out = {};
  for (const key of keys) {
    const v = process.env[key];
    out[key] = v ? "set" : "missing";
  }
  console.log("env:", out);
}

export function logDbTarget(label, url) {
  try {
    const u = new URL(String(url));
    console.log(label, {
      host: u.host,
      hostname: u.hostname,
      port: u.port,
      db: u.pathname,
      user: u.username,
      params: Object.fromEntries(u.searchParams.entries()),
      urlMasked: maskDbUrl(u.toString()),
    });
  } catch (e) {
    console.log(label, { urlMasked: maskDbUrl(url), parseError: e?.message || e });
  }
}

export function logError(err, { label = "error" } = {}) {
  console.error(`\n${label}:`, err?.message || err);
  if (err?.stack) console.error("stack:", err.stack);

  const metaKeys = [
    "code",
    "errno",
    "syscall",
    "address",
    "port",
    "detail",
    "hint",
    "where",
    "schema",
    "table",
    "column",
    "routine",
    "severity",
  ];
  const meta = {};
  for (const k of metaKeys) if (err?.[k] != null) meta[k] = err[k];
  if (Object.keys(meta).length) console.error("meta:", meta);

  if (err?.cause) console.error("cause:", err.cause);
}

export async function time(label, fn) {
  const start = Date.now();
  try {
    const result = await fn();
    console.log(`${label}: ok (${Date.now() - start}ms)`);
    return result;
  } catch (e) {
    console.log(`${label}: fail (${Date.now() - start}ms)`);
    throw e;
  }
}

