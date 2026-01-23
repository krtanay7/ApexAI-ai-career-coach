// Simple in-memory cache with TTL (Time To Live)
// This reduces API calls by caching responses

const cache = new Map();

export function getCacheKey(...args) {
  return JSON.stringify(args);
}

export function getFromCache(key) {
  const item = cache.get(key);
  
  if (!item) return null;
  
  // Check if cache expired (24 hour TTL)
  const now = Date.now();
  if (now - item.timestamp > 24 * 60 * 60 * 1000) {
    cache.delete(key);
    return null;
  }
  
  return item.data;
}

export function setInCache(key, data) {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

export function clearCache() {
  cache.clear();
}

export function getCacheStats() {
  return {
    size: cache.size,
    entries: Array.from(cache.keys()),
  };
}
