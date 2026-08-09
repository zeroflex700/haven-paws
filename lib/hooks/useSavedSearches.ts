"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { Filters } from "@/app/components/PuppyFilters";

export type SavedSearch = { id: string; label: string; filters: Filters };

export function useSavedSearches() {
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserId(session?.user?.id ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const refresh = useCallback(async () => {
    if (!userId) {
      setSearches([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from("saved_searches")
      .select("id, label, filters")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    setSearches((data ?? []) as SavedSearch[]);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const save = useCallback(
    async (label: string, filters: Filters) => {
      if (!userId) return false;
      const { error } = await supabase.from("saved_searches").insert({ user_id: userId, label, filters });
      if (!error) await refresh();
      return !error;
    },
    [userId, refresh]
  );

  const remove = useCallback(
    async (id: string) => {
      await supabase.from("saved_searches").delete().eq("id", id);
      await refresh();
    },
    [refresh]
  );

  return { searches, loading, isLoggedIn: !!userId, save, remove };
}