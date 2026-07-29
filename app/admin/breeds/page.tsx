import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminBreedsPage() {
  const supabase = await createClient();
  const { data: breeds } = await supabase
    .from("breeds")
    .select("id, name, temperament")
    .order("name");

  return (
    <main className="px-5 pt-6 pb-10">
      <p className="eyebrow mb-1">Haven Paws Admin</p>
      <h1 className="font-display text-2xl text-forest mb-1">Breed Info</h1>
      <p className="text-sm text-sage mb-6">
        Fill in details once per breed — they show on every puppy of that breed.
      </p>

      <div className="space-y-2">
        {(breeds ?? []).map((b) => (
          <Link
            key={b.id}
            href={`/admin/breeds/${b.id}`}
            className="flex items-center justify-between bg-white border border-sage/20 rounded-lg px-4 py-3"
          >
            <span className="text-forest">{b.name}</span>
            {!b.temperament && (
              <span className="text-[10px] uppercase tracking-wider text-sage">
                Not filled in
              </span>
            )}
          </Link>
        ))}
      </div>
    </main>
  );
}