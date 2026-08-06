import { createClient } from "@/lib/supabase/server";
import { addHealthTesting, deleteHealthTesting } from "../../content-actions";
import DeleteGenericButton from "../../../components/DeleteGenericButton";
import { ICON_OPTIONS } from "@/lib/breederIcons";
import { notFound } from "next/navigation";

export default async function HealthTestingPage({ params }: { params: Promise<{ breederId: string }> }) {
  const { breederId } = await params;
  const supabase = await createClient();
  const { data: breeder } = await supabase.from("breeders").select("name, slug").eq("id", breederId).single();
  if (!breeder) notFound();

  const breederSlug = breeder.slug;
  const breederName = breeder.name;

  const { data: items } = await supabase
    .from("breeder_health_testing")
    .select("id, icon_key, heading, body")
    .eq("breeder_id", breederId)
    .order("sort_order");

  const removeItem = async (id: string) => {
    "use server";
    await deleteHealthTesting(id, breederSlug);
  };
  async function handleAdd(formData: FormData) {
    "use server";
    await addHealthTesting(
      breederId,
      breederSlug,
      formData.get("icon_key") as string,
      formData.get("heading") as string,
      formData.get("body") as string
    );
  }

  return (
    <main className="px-5 pt-6 pb-10">
      <p className="eyebrow mb-1">Haven Paws Admin</p>
      <h1 className="font-display text-xl text-forest mb-6">Parent Health Testing — {breederName}</h1>

      <form action={handleAdd} className="bg-white border border-sage/20 rounded-lg p-4 mb-6">
        <label className="block text-sm text-ink/80 mb-1">Icon</label>
        <select name="icon_key" required className="w-full border border-sage/30 rounded-md px-3 py-2 mb-3">
          {ICON_OPTIONS.map((o) => (
            <option key={o.key} value={o.key}>{o.label}</option>
          ))}
        </select>
        <label className="block text-sm text-ink/80 mb-1">Heading</label>
        <input name="heading" required className="w-full border border-sage/30 rounded-md px-3 py-2 mb-3" />
        <label className="block text-sm text-ink/80 mb-1">Body</label>
        <textarea name="body" required rows={3} className="w-full border border-sage/30 rounded-md px-3 py-2 mb-4" />
        <button type="submit" className="w-full bg-forest text-cream py-2.5 rounded-full hover:bg-forest-light">
          Add Entry
        </button>
      </form>

      {(items ?? []).map((item) => (
        <div key={item.id} className="flex justify-between items-start bg-white border border-sage/20 rounded-lg p-4 mb-3">
          <div>
            <p className="text-forest font-medium">{item.heading}</p>
            <p className="text-sm text-ink/70">{item.body}</p>
          </div>
          <DeleteGenericButton id={item.id} onDelete={removeItem} />
        </div>
      ))}
    </main>
  );
}