import { createClient } from "@/lib/supabase/server";
import { addBreederPhoto, deleteBreederPhoto } from "../../content-actions";
import SimpleImageUploadForm from "../../../components/SimpleImageUploadForm";
import DeleteGenericButton from "../../../components/DeleteGenericButton";
import { notFound } from "next/navigation";

export default async function BreederPhotosPage({ params }: { params: Promise<{ breederId: string }> }) {
  const { breederId } = await params;
  const supabase = await createClient();
  const { data: breeder } = await supabase.from("breeders").select("name, slug").eq("id", breederId).single();
  if (!breeder) notFound();

  const { data: photos } = await supabase
    .from("breeder_photos")
    .select("id, image_url")
    .eq("breeder_id", breederId)
    .order("sort_order");

  const upload = async (url: string) => {
    "use server";
    await addBreederPhoto(breederId, breeder.slug, url);
  };
  const remove = async (id: string) => {
    "use server";
    await deleteBreederPhoto(id, breeder.slug);
  };

  return (
    <main className="px-5 pt-6 pb-10">
      <p className="eyebrow mb-1">Haven Paws Admin</p>
      <h1 className="font-display text-xl text-forest mb-1">{breeder.name}&apos;s Photos</h1>
      <p className="text-sm text-sage mb-4">Unbounded — add as many as you like.</p>

      <SimpleImageUploadForm onUpload={upload} label="Upload Photo" />

      <div className="grid grid-cols-3 gap-2 mt-6">
        {(photos ?? []).map((p) => (
          <div key={p.id} className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.image_url} alt="" className="w-full aspect-square object-cover rounded-lg" />
            <div className="mt-1">
              <DeleteGenericButton id={p.id} onDelete={remove} />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}