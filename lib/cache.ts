import { getRedis } from "./redis";

/**
 * Cache-aside helper: try Redis first, fall back to `fetcher()` on a
 * miss OR on any Redis error. Redis is never allowed to make a request
 * fail — every failure path falls through to Supabase.
 */
export async function getOrSetCache<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>
): Promise<T> {
  const redis = getRedis();

  if (!redis) {
    return fetcher();
  }

  try {
    const cached = await redis.get<T>(key);
    if (cached !== null && cached !== undefined) {
      return cached;
    }
  } catch (err) {
    console.error(`Redis GET failed for key "${key}":`, err);
    return fetcher();
  }

  const fresh = await fetcher();

  try {
    await redis.set(key, fresh, { ex: ttlSeconds });
  } catch (err) {
    console.error(`Redis SET failed for key "${key}":`, err);
  }

  return fresh;
}

export async function deleteCacheKeys(keys: string[]): Promise<void> {
  const redis = getRedis();
  if (!redis || keys.length === 0) return;

  try {
    await redis.del(...keys);
  } catch (err) {
    console.error(`Redis DEL failed for keys [${keys.join(", ")}]:`, err);
  }
}

/**
 * Deletes every key matching `${prefix}*`. Used for caches keyed by more
 * than one variable (e.g. related puppies by breed+excludeId) where we
 * can't know every exact key that might exist.
 */
export async function deleteCacheByPrefix(prefix: string): Promise<void> {
  const redis = getRedis();
  if (!redis) return;

  try {
    let cursor = "0";
    const keysToDelete: string[] = [];

    do {
      const [nextCursor, keys] = await redis.scan(cursor, {
        match: `${prefix}*`,
        count: 100,
      });
      cursor = nextCursor;
      keysToDelete.push(...keys);
    } while (cursor !== "0");

    if (keysToDelete.length > 0) {
      await redis.del(...keysToDelete);
    }
  } catch (err) {
    console.error(`Redis SCAN/DEL failed for prefix "${prefix}":`, err);
  }
}