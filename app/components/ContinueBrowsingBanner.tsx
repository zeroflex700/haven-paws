"use client";

import Link from "next/link";
import { ArrowRight, History } from "lucide-react";
import { usePersistentFilters } from "@/lib/hooks/usePersistentFilters";
import { useRecentlyViewed } from "@/lib/hooks/useRecentlyViewed";
import type { Filters } from "./PuppyFilters";

const DEFAULT_FILTERS: Filters = { search: "", breed: "all", sex: "all", readyNow: false, sort: "none" };

function buildResumeLink(filters: Filters): string {
  const params = new URLSearchParams();
  if (filters.search.trim()) params.set("search", filters.search.trim());
  if (filters.breed !== "all") params.set("breed", filters.breed);
  const qs = params.toString();
  return qs ? `/puppies?${qs}` : "/puppies";
}

function describeFilters(filters: Filters): string {
  const parts: string[] = [];
  if (filters.breed !== "all") parts.push(filters.breed);
  if (filters.search.trim()) parts.push(`"${filters.search.trim()}"`);
  if (filters.sex !== "all") parts.push(filters.sex === "male" ? "male" : "female");
  if (filters.readyNow) parts.push("ready to go home");
  return parts.length > 0 ? parts.join(" · ") : "your last search";
}

export default function ContinueBrowsingBanner() {
  const [filters] = usePersistentFilters<Filters>("havenpaws_puppy_filters", DEFAULT_FILTERS);
  const { items } = useRecentlyViewed();

  const hasFilterState =
    filters.search.trim() !== "" || filters.breed !== "all" || filters.sex !== "all" || filters.readyNow;
  const lastViewed = items.find((i) => i.type === "puppy");

  if (!hasFilterState && !lastViewed) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-10 pt-8">
      <div className="bg-cream-alt border border-sage/20 rounded-lg p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <History size={18} className="text-gold shrink-0" strokeWidth={1.5} />
          <div className="min-w-0">
            <p className="text-sm text-forest font-medium">Continue where you left off</p>
            <p className="text-xs text-sage truncate">
              {hasFilterState ? `Browsing ${describeFilters(filters)}` : `Last viewed ${lastViewed?.name}`}
            </p>
          </div>
        </div>
        <Link
          href={hasFilterState ? buildResumeLink(filters) : lastViewed?.href ?? "/puppies"}
          className="shrink-0 flex items-center gap-1 text-sm text-forest border-b border-gold pb-0.5"
        >
          Resume <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}