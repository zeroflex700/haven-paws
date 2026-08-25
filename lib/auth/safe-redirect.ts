const AUTH_PATHS = ["/account/login", "/account/signup", "/auth/callback"];

export function getSafeRedirect(
  path: string | null | undefined,
  fallback = "/account"
): string {
  if (!path) return fallback;
  if (!path.startsWith("/") || path.startsWith("//") || path.startsWith("/\\")) {
    return fallback;
  }
  const pathname = path.split("?")[0].split("#")[0];
  if (AUTH_PATHS.includes(pathname)) return fallback;
  return path;
}