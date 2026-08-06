import Link from "next/link";
import { getAllBreedersAdmin } from "@/lib/queries/breeders";

export default async function AdminBreedersPage() {
  const breeders = await getAllBreedersAdmin();

  return (
    <main className="px-5 pt-6 pb-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="eyebrow mb-1">Haven Paws Admin</p>
          <h1 className="font-display text-xl text-forest">Breeders</h1>
        </div>
        <Link href="/admin/breeders/new" className="bg-forest text-cream text-sm px-4 py-2 rounded-full hover:bg-forest-light">
          + Add
        </Link>
      </div>

      {breeders.length === 0 ? (
        <p className="text-sage">No breeder profiles yet.</p>
      ) : (
        <div className="space-y-2">
          {breeders.map((b) => (
            <Link
              key={b.id}
              href={`/admin/breeders/${b.id}`}
              className="flex items-center justify-between bg-white border border-sage/20 rounded-lg px-4 py-3"
            >
              <span className="text-forest">{b.name}</span>
              <span className="text-xs text-sage">{b.breedName ?? "No breed set"}</span>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}