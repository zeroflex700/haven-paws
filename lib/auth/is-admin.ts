import { createClient } from "@/lib/supabase/server";

/**
 * Checks whether the given user id is present in admin_users. Uses the
 * normal per-request Supabase client (anon key + session cookies), not
 * the service role key — the "admins read own row" RLS policy on
 * admin_users already scopes this safely: a caller can only ever see
 * their OWN row, so this can never leak another user's admin status.
 */
export async function isAdminUser(userId: string): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("admin_users")
      .select("id, role")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error("Admin allowlist check failed:", error);
      return false;
    }

    return Boolean(data);
  } catch (err) {
    console.error("Admin allowlist check threw:", err);
    return false;
  }
}