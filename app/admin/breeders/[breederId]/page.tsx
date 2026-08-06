import Link from "next/link";
import { getBreederAdmin, getBreederHomePhotos } from "@/lib/queries/breeders";
import { createClient } from "@/lib/supabase/server";
import { addHomePhoto, deleteHomePhoto } from "../content-actions";
import BreederForm from "../../components/BreederForm";
import SimpleImageUploadForm from "../../components/SimpleImageUploadForm";
import DeleteGenericButton from "../../components/DeleteGenericButton";
import { notFound } from "next/navigation";

export default async function EditBreederPage({
  params,
}: {
  params: Promise<{ breederId: string }>;
}) {
  const { breederId } = await params;
  const breeder = await getBreederAdmin(breederId);
  if (!breeder) notFound();

  const supabase = await createClient();
  const { data: breeds } = await supabase.from("breeds").select("id, name").order("name");
  const { data: rawBreeder } = await supabase.from("breeders").select("breed_id").eq("id", breederId).single();
  const homePhotos = await getBreederHomePhotos(breederId);

  const uploadHomePhoto = async (url: string) => {
    "use server";
    await addHomePhoto(breederId, breeder.slug, url);
  };
  const removeHomePhoto = async (id: string) => {
    "use server";
    await deleteHomePhoto(id, breeder.slug);
  };

  const sections = [
    { label: "Q&A (Section 2)", href: `/admin/breeders/${breederId}/qa` },
    { label: "Photo Strip (Section 3)", href: `/admin/breeders/${breederId}/photos` },
    { label: "What's Included (Sections 6–7)", href: `/admin/breeders/${breederId}/included-items` },
    { label: "More About (Section 8)", href: `/admin/breeders/${breederId}/more-about` },
    { label: "Qualifications (Section 9)", href: `/admin/breeders/${breederId}/qualifications` },
    { label: "Parent Health Testing (Sections 10–11)", href: `/admin/breeders/${breederId}/health-testing` },
  ];

  return (
    <main className="px-5 pt-6 pb-10">
      <p className="eyebrow mb-1">Haven Paws Admin</p>
      <h1 className="font-display text-xl text-forest mb-1">{breeder.name}</h1>
      <p className="text-sm text-sage mb-4">
        Public page:{" "}
        <Link href={`/breeders/${breeder.slug}`} className="underline text-forest">
          /breeders/{breeder.slug}
        </Link>
      </p>

      <div className="grid grid-cols-2 gap-2 mb-8">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="text-sm text-forest border border-sage/20 rounded-lg px-3 py-2 bg-white"
          >
            {s.label} →
          </Link>
        ))}
      </div>

      <BreederForm
        breeder={{ ...breeder, breedId: rawBreeder?.breed_id ?? null }}
        breeds={breeds ?? []}
      />

      <h2 className="font-display text-lg text-forest mb-3 mt-10">
        Home Gallery Photos ({homePhotos.length}/6)
      </h2>
      {homePhotos.map((p) => (
        <div key={p.id} className="flex items-center justify-between bg-white border border-sage/20 rounded-lg p-3 mb-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.imageUrl} alt="" className="w-16 h-16 rounded-lg object-cover" />
          <DeleteGenericButton id={p.id} onDelete={removeHomePhoto} />
        </div>
      ))}
      {homePhotos.length < 6 && (
        <SimpleImageUploadForm onUpload={uploadHomePhoto} label="Upload Home Photo" />
      )}
    </main>
  );
}