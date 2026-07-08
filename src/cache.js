import fs from "node:fs";

const CACHE_PATH = new URL("../cache.json", import.meta.url);
const RETENTION_DAYS = 30;

function loadCache() {
  try {
    return JSON.parse(fs.readFileSync(CACHE_PATH, "utf-8"));
  } catch {
    return {};
  }
}

function saveCache(cache) {
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
}

export function filterNew(items) {
  const cache = loadCache();
  const now = Date.now();
  const fresh = items.filter((item) => !cache[item.url]);

  for (const item of fresh) {
    cache[item.url] = now;
  }

  const cutoff = now - RETENTION_DAYS * 24 * 60 * 60 * 1000;
  for (const [url, ts] of Object.entries(cache)) {
    if (ts < cutoff) delete cache[url];
  }

  saveCache(cache);
  return fresh;
}
