import { createClient } from "@/lib/supabase/server";
import { addGuideFaq, deleteGuideFaq } from "../../faqs-actions";
import DeleteGenericButton from "../../../components/DeleteGenericButton";
import { notFound } from "next/navigation";

export default async function GuideFaqsPage({
  params,
}: {
  params: Promise<{ breedId: string }>;
}) {
  const { breedId } = await params;
  const supabase = await createClient();

  const { data: breed } = await supabase.from("breeds").select("name, slug").eq("id", breedId).single();
  const { data: guide } = await supabase.from("breed_guides").select("id").eq("breed_id", breedId).single();

  if (!breed || !guide) notFound();

  const { data: faqs } = await supabase
    .from("breed_guide_faqs")
    .select("id, question, answer")
    .eq("breed_guide_id", guide.id)
    .order("sort_order");

  const addWithIds = addGuideFaq.bind(null, guide.id, breed.slug);
  const deleteWithSlug = async (id: string) => {
    "use server";
    await deleteGuideFaq(id, breed.slug);
  };

  async function handleAdd(formData: FormData) {
    "use server";
    await addWithIds(formData.get("question") as string, formData.get("answer") as string);
  }

  return (
    <main className="px-5 pt-6 pb-10">
      <p className="eyebrow mb-1">Haven Paws Admin</p>
      <h1 className="font-display text-2xl text-forest mb-6">{breed.name} — FAQs</h1>

      <form action={handleAdd} className="bg-white border border-sage/20 rounded-lg p-4 mb-6">
        <label className="block text-sm text-ink/80 mb-1">Question</label>
        <input name="question" required className="w-full border border-sage/30 rounded-md px-3 py-2 mb-3" />
        <label className="block text-sm text-ink/80 mb-1">Answer</label>
        <textarea name="answer" rows={3} className="w-full border border-sage/30 rounded-md px-3 py-2 mb-4" />
        <button type="submit" className="w-full bg-forest text-cream py-2.5 rounded-full hover:bg-forest-light">
          Add FAQ
        </button>
      </form>

      {(faqs ?? []).map((faq) => (
        <div key={faq.id} className="flex justify-between items-start bg-white border border-sage/20 rounded-lg p-4 mb-3">
          <div>
            <p className="text-forest font-medium">{faq.question}</p>
            <p className="text-sm text-ink/70">{faq.answer}</p>
          </div>
          <DeleteGenericButton id={faq.id} onDelete={deleteWithSlug} />
        </div>
      ))}
    </main>
  );
}