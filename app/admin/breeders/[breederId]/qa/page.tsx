import { createClient } from "@/lib/supabase/server";
import { addBreederQA, deleteBreederQA } from "../../content-actions";
import DeleteGenericButton from "../../../components/DeleteGenericButton";
import { notFound } from "next/navigation";

export default async function BreederQAPage({ params }: { params: Promise<{ breederId: string }> }) {
  const { breederId } = await params;
  const supabase = await createClient();
  const { data: breeder } = await supabase.from("breeders").select("name, slug").eq("id", breederId).single();
  if (!breeder) notFound();

  const breederName = breeder.name;
  const breederSlug = breeder.slug;

  const { data: items } = await supabase
    .from("breeder_qa")
    .select("id, question, answer")
    .eq("breeder_id", breederId)
    .order("sort_order");

  const deleteWithSlug = async (id: string) => {
    "use server";
    await deleteBreederQA(id, breederSlug);
  };
  async function handleAdd(formData: FormData) {
    "use server";
    await addBreederQA(breederId, breederSlug, formData.get("question") as string, formData.get("answer") as string);
  }

  return (
    <main className="px-5 pt-6 pb-10">
      <p className="eyebrow mb-1">Haven Paws Admin</p>
      <h1 className="font-display text-xl text-forest mb-6">Q. &amp; A. with {breederName}</h1>

      <form action={handleAdd} className="bg-white border border-sage/20 rounded-lg p-4 mb-6">
        <label className="block text-sm text-ink/80 mb-1">Question</label>
        <input name="question" required className="w-full border border-sage/30 rounded-md px-3 py-2 mb-3" />
        <label className="block text-sm text-ink/80 mb-1">Answer</label>
        <textarea name="answer" required rows={3} className="w-full border border-sage/30 rounded-md px-3 py-2 mb-4" />
        <button type="submit" className="w-full bg-forest text-cream py-2.5 rounded-full hover:bg-forest-light">
          Add Q&amp;A
        </button>
      </form>

      {(items ?? []).map((item) => (
        <div key={item.id} className="flex justify-between items-start bg-white border border-sage/20 rounded-lg p-4 mb-3">
          <div>
            <p className="text-forest font-medium">{item.question}</p>
            <p className="text-sm text-ink/70">{item.answer}</p>
          </div>
          <DeleteGenericButton id={item.id} onDelete={deleteWithSlug} />
        </div>
      ))}
    </main>
  );
}