import { createClient } from "@/lib/supabase/server";
import { deleteQualification } from "../../content-actions";
import QualificationForm from "../../../components/QualificationForm";
import DeleteGenericButton from "../../../components/DeleteGenericButton";
import { notFound } from "next/navigation";

export default async function QualificationsPage({ params }: { params: Promise<{ breederId: string }> }) {
  const { breederId } = await params;
  const supabase = await createClient();
  const { data: breeder } = await supabase.from("breeders").select("name, slug").eq("id", breederId).single();
  if (!breeder) notFound();

  const breederSlug = breeder.slug;

  const { data: items } = await supabase
    .from("breeder_qualifications")
    .select("id, badge_image_url, label_line, title_line")
    .eq("breeder_id", breederId)
    .order("sort_order");

  const count = items?.length ?? 0;
  const removeItem = async (id: string) => {
    "use server";
    await deleteQualification(id, breederSlug);
  };

  return (
    <main className="px-5 pt-6 pb-10">
      <p className="eyebrow mb-1">Haven Paws Admin</p>
      <h1 className="font-display text-xl text-forest mb-1">Breeder Qualifications</h1>
      <p className="text-sm text-sage mb-6">{count}/8 slots used</p>

      {count < 8 ? (
        <QualificationForm breederId={breederId} breederSlug={breederSlug} />
      ) : (
        <p className="text-sm text-sage mb-6">Maximum of 8 reached — delete one to add another.</p>
      )}

      <div className="grid grid-cols-2 gap-3">
        {(items ?? []).map((item) => (
          <div key={item.id} className="bg-white border border-sage/20 rounded-lg p-3">
            {item.badge_image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.badge_image_url} alt="" className="w-12 h-12 rounded-lg object-cover mb-2" />
            )}
            <p className="text-xs text-sage">{item.label_line}</p>
            <p className="text-sm text-forest font-medium">{item.title_line}</p>
            <div className="mt-2">
              <DeleteGenericButton id={item.id} onDelete={removeItem} />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}