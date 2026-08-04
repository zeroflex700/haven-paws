import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminBreedGuidesPage() {
  const supabase = await createClient();
  const { data: breeds } = await supabase.from("breeds").select("id, name").order("name");
  const { data: guides } = await supabase.from("breed_guides").select("breed_id");

  const guidedIds = new Set((guides ?? []).map((g) => g.breed_id));

  return (
    <main className="px-5 pt-6 pb-10">
      <p className="eyebrow mb-1">Haven Paws Admin</p>
      <h1 className="font-display text-2xl text-forest mb-6">Breed Guides</h1>

      <div className="space-y-2">
        {(breeds ?? []).map((b) => (
          <Link
            key={b.id}
            href={`/admin/breed-guides/${b.id}`}
            className="flex items-center justify-between bg-white border border-sage/20 rounded-lg px-4 py-3"
          >
            <span className="text-forest">{b.name}</span>
            {!guidedIds.has(b.id) && (
              <span className="text-[10px] uppercase tracking-wider text-sage">No guide yet</span>
            )}
          </Link>
        ))}
      </div>
    </main>
  );
}