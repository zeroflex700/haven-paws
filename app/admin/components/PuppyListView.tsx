"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import PuppySearchBar from "./PuppySearchBar";
import PuppyRowActions from "./PuppyRowActions";

type AdminPuppy = {
  id: string;
  name: string;
  price: number;
  status: "available" | "reserved" | "sold" | "hidden";
  is_published: boolean;
  litter_id: string | null;
  breeds: { name: string } | null;
};

export default function PuppyListView({ puppies }: { puppies: AdminPuppy[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [collapsedBreeds, setCollapsedBreeds] = useState<Set<string>>(
    new Set()
  );

  const filtered = useMemo(() => {
    return puppies.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.breeds?.name ?? "").toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [puppies, search, statusFilter]);

  const groupedByBreed = useMemo(() => {
    const groups = new Map<string, AdminPuppy[]>();

    for (const puppy of filtered) {
      const breedName = puppy.breeds?.name ?? "No breed";
      const existing = groups.get(breedName) ?? [];
      existing.push(puppy);
      groups.set(breedName, existing);
    }

    return Array.from(groups.entries()).sort((a, b) =>
      a[0].localeCompare(b[0])
    );
  }, [filtered]);

  function toggleBreed(breedName: string) {
    setCollapsedBreeds((current) => {
      const next = new Set(current);
      if (next.has(breedName)) {
        next.delete(breedName);
      } else {
        next.add(breedName);
      }
      return next;
    });
  }

  return (
    <div>
      <PuppySearchBar value={search} onChange={setSearch} />

      <div className="flex gap-2 mb-4 overflow-x-auto">
        {["all", "available", "reserved", "sold", "hidden"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap capitalize ${
              statusFilter === s
                ? "bg-forest text-cream"
                : "bg-white border border-sage/30 text-ink/70"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {groupedByBreed.length === 0 ? (
        <p className="text-sage">No puppies match.</p>
      ) : (
        <div className="space-y-4">
          {groupedByBreed.map(([breedName, breedPuppies]) => {
            const isCollapsed = collapsedBreeds.has(breedName);

            return (
              <div
                key={breedName}
                className="overflow-hidden rounded-2xl border border-sage/20 bg-white"
              >
                <button
                  type="button"
                  onClick={() => toggleBreed(breedName)}
                  className="flex w-full items-center justify-between px-4 py-3.5 text-left transition hover:bg-sage/5"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-display text-lg text-forest">
                      {breedName}
                    </span>

                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-forest/10 px-1.5 text-xs font-semibold text-forest">
                      {breedPuppies.length}
                    </span>
                  </div>

                  <ChevronDown
                    size={17}
                    className={`text-sage transition-transform ${
                      isCollapsed ? "" : "rotate-180"
                    }`}
                  />
                </button>

                {!isCollapsed && (
                  <div className="space-y-3 border-t border-sage/10 p-3">
                    {breedPuppies.map((p) => (
                      <Link
                        key={p.id}
                        href={`/admin/puppies/${p.id}`}
                        className="flex items-center justify-between bg-cream-alt/60 border border-sage/15 rounded-lg px-4 py-3 transition hover:border-forest/20"
                      >
                        <div className="min-w-0">
                          <p className="text-forest font-medium">{p.name}</p>
                          {p.litter_id && (
                            <p className="text-[10px] text-ink/40 mt-0.5 truncate max-w-[160px]">
                              Litter: {p.litter_id}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-sm text-ink">
                              ${Number(p.price).toLocaleString()}
                            </p>
                            <span
                              className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                p.status === "available"
                                  ? "bg-gold text-forest"
                                  : p.status === "reserved"
                                  ? "bg-sage text-cream"
                                  : "border border-ink/30 text-ink/60"
                              }`}
                            >
                              {p.status}
                            </span>
                          </div>
                          <PuppyRowActions
                            id={p.id}
                            isPublished={p.is_published}
                          />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}