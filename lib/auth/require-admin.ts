import { createClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/auth/is-admin";

/**
 * Call this at the top of every admin Server Action. Throws if the
 * caller is not authenticated AND allow-listed in admin_users.
 *
 * Middleware already blocks non-admins from reaching admin pages in the
 * browser, but a Server Action is a real network endpoint — it can be
 * called directly (e.g. crafted requests, browser devtools) bypassing
 * the UI and even the page-level middleware in some edge cases. This
 * check must never be skipped just because "only the admin UI calls
 * this function."
 */
export async function requireAdmin(): Promise<{ id: string; email: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated.");
  }

  const admin = await isAdminUser(user.id);

  if (!admin) {
    throw new Error("Not authorized.");
  }

  return { id: user.id, email: user.email ?? null };
}