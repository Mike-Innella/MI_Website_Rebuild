type CacheEntry = {
  docs: any[];
  cachedAt: number;
};

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const MAX_ENTRIES = 120;

const contextCache = new Map<string, CacheEntry>();

function pruneCache() {
  if (contextCache.size <= MAX_ENTRIES) return;
  const keys = Array.from(contextCache.keys());
  const overshoot = contextCache.size - MAX_ENTRIES;
  for (let i = 0; i < overshoot; i += 1) {
    const key = keys[i];
    if (key) contextCache.delete(key);
  }
}

export function getCachedContext(sessionId: string) {
  const cached = contextCache.get(sessionId);
  if (!cached) return null;
  const isStale = Date.now() - cached.cachedAt > CACHE_TTL_MS;
  if (isStale) {
    contextCache.delete(sessionId);
    return null;
  }
  return cached.docs;
}

export function setCachedContext(sessionId: string, docs: any[]) {
  contextCache.set(sessionId, { docs, cachedAt: Date.now() });
  pruneCache();
}
