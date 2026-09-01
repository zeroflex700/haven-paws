import { getGlobalIncludedItems } from "@/lib/queries/breeders";
import { addGlobalIncludedItem, deleteGlobalIncludedItem } from "./actions";
import DeleteGenericButton from "../components/DeleteGenericButton";
import { CATEGORY_META, CATEGORY_ORDER } from "@/lib/breederIcons";

export default async function GlobalIncludedItemsPage() {
  const items = await getGlobalIncludedItems();

  return (
    <main className="px-5 pt-6 pb-10">
      <p className="eyebrow mb-1">Haven Paws Admin</p>
      <h1 className="font-display text-xl text-forest mb-1">
        What&apos;s Included
      </h1>
      <p className="text-sm text-sage mb-6">
        Shared across every breeder&apos;s public page. Add or remove an
        item here and it updates everywhere at once — no need to repeat
        this per breeder.
      </p>

      <form
        action={addGlobalIncludedItem}
        className="bg-white border border-sage/20 rounded-lg p-4 mb-6"
      >
        <label className="block text-sm text-ink/80 mb-1">Category</label>
        <select
          name="category"
          required
          className="w-full border border-sage/30 rounded-md px-3 py-2 mb-3"
        >
          {CATEGORY_ORDER.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_META[c].label}
            </option>
          ))}
        </select>

        <label className="block text-sm text-ink/80 mb-1">Item</label>
        <input
          name="label"
          required
          placeholder="e.g. Vet check, Various sounds, Car rides"
          className="w-full border border-sage/30 rounded-md px-3 py-2 mb-4"
        />

        <button
          type="submit"
          className="w-full bg-forest text-cream py-2.5 rounded-full hover:bg-forest-light"
        >
          Add Item
        </button>
      </form>

      {CATEGORY_ORDER.map((cat) => {
        const catItems = items.filter((i) => i.category === cat);
        if (catItems.length === 0) return null;

        return (
          <div key={cat} className="mb-6">
            <p className="text-sm font-medium text-forest mb-2">
              {CATEGORY_META[cat].label}
            </p>

            {catItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center bg-white border border-sage/20 rounded-lg px-4 py-2 mb-2"
              >
                <span className="text-sm text-ink">{item.label}</span>
                <DeleteGenericButton
                  id={item.id}
                  onDelete={deleteGlobalIncludedItem}
                />
              </div>
            ))}
          </div>
        );
      })}
    </main>
  );
}
