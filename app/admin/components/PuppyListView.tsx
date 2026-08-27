"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
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

  const filtered = useMemo(() => {
    return puppies.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.breeds?.name ?? "").toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [puppies, search, statusFilter]);

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

      {filtered.length === 0 ? (
        <p className="text-sage">No puppies match.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => (
            <Link
              key={p.id}
              href={`/admin/puppies/${p.id}`}
              className="flex items-center justify-between bg-white border border-sage/20 rounded-lg px-4 py-3"
            >
              <div className="min-w-0">
                <p className="text-forest font-medium">{p.name}</p>
                <p className="text-xs text-sage">{p.breeds?.name ?? "No breed"}</p>
                {p.litter_id && (
                  <p className="text-[10px] text-ink/40 mt-0.5 truncate max-w-[160px]">
                    Litter: {p.litter_id}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm text-ink">${Number(p.price).toLocaleString()}</p>
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
                <PuppyRowActions id={p.id} isPublished={p.is_published} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}