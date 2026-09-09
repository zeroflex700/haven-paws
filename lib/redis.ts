import { Redis } from "@upstash/redis";

let redis: Redis | null = null;
let attempted = false;

/**
 * Returns a singleton Redis client, or null if the required env vars
 * aren't configured. Callers must treat null as "cache disabled" and
 * fall back to Supabase — this is what makes Redis an optional
 * optimization layer rather than a hard dependency.
 *
 * Uses the KV_REST_API_* names because that's what Vercel's Upstash
 * Marketplace integration injects automatically.
 */
export function getRedis(): Redis | null {
  if (redis) return redis;
  if (attempted) return null;

  attempted = true;

  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    console.warn(
      "Redis env vars not set — caching disabled, falling back to Supabase."
    );
    return null;
  }

  redis = new Redis({ url, token });
  return redis;
}