import { createClient } from "@/lib/supabase/server";
import { addIncludedItem, deleteIncludedItem } from "../../content-actions";
import DeleteGenericButton from "../../../components/DeleteGenericButton";
import { CATEGORY_META, CATEGORY_ORDER } from "@/lib/breederIcons";
import { notFound } from "next/navigation";

export default async function IncludedItemsPage({ params }: { params: Promise<{ breederId: string }> }) {
  const { breederId } = await params;
  const supabase = await createClient();
  const { data: breeder } = await supabase.from("breeders").select("name, slug").eq("id", breederId).single();
  if (!breeder) notFound();

  const { data: items } = await supabase
    .from("breeder_included_items")
    .select("id, category, label")
    .eq("breeder_id", breederId)
    .order("sort_order");

  const removeItem = async (id: string) => {
    "use server";
    await deleteIncludedItem(id, breeder.slug);
  };
  async function handleAdd(formData: FormData) {
    "use server";
    await addIncludedItem(breederId, breeder.slug, formData.get("category") as string, formData.get("label") as string);
  }

  return (
    <main className="px-5 pt-6 pb-10">
      <p className="eyebrow mb-1">Haven Paws Admin</p>
      <h1 className="font-display text-xl text-forest mb-6">What&apos;s Included — {breeder.name}</h1>

      <form action={handleAdd} className="bg-white border border-sage/20 rounded-lg p-4 mb-6">
        <label className="block text-sm text-ink/80 mb-1">Category</label>
        <select name="category" required className="w-full border border-sage/30 rounded-md px-3 py-2 mb-3">
          {CATEGORY_ORDER.map((c) => (
            <option key={c} value={c}>{CATEGORY_META[c].label}</option>
          ))}
        </select>
        <label className="block text-sm text-ink/80 mb-1">Item</label>
        <input
          name="label"
          required
          placeholder="e.g. Vet check, Various sounds, Car rides"
          className="w-full border border-sage/30 rounded-md px-3 py-2 mb-4"
        />
        <button type="submit" className="w-full bg-forest text-cream py-2.5 rounded-full hover:bg-forest-light">
          Add Item
        </button>
      </form>

      {CATEGORY_ORDER.map((cat) => {
        const catItems = (items ?? []).filter((i) => i.category === cat);
        if (catItems.length === 0) return null;
        return (
          <div key={cat} className="mb-6">
            <p className="text-sm font-medium text-forest mb-2">{CATEGORY_META[cat].label}</p>
            {catItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center bg-white border border-sage/20 rounded-lg px-4 py-2 mb-2">
                <span className="text-sm text-ink">{item.label}</span>
                <DeleteGenericButton id={item.id} onDelete={removeItem} />
              </div>
            ))}
          </div>
        );
      })}
    </main>
  );
}