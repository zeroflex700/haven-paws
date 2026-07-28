"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";

export default function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button onClick={handleSignOut} className="flex items-center gap-1 text-sm text-sage hover:text-ink">
      <LogOut size={16} strokeWidth={1.5} />
      Sign Out
    </button>
  );
}