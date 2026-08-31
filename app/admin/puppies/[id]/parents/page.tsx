
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ParentInfoForm from "../../../components/ParentInfoForm";
import { notFound } from "next/navigation";

export default async function PuppyParentsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: puppy } = await supabase
    .from("puppies")
    .select(
      "name, mom_name, mom_breed, mom_weight, mom_registration, mom_photo_url, dad_name, dad_breed, dad_weight, dad_registration, dad_photo_url"
    )
    .eq("id", id)
    .single();

  if (!puppy) notFound();

  return (
    <main className="px-5 pt-6 pb-10">
      <p className="eyebrow mb-1">Haven Paws Admin</p>
      <h1 className="font-display text-2xl text-forest mb-1">
        {puppy.name}&apos;s Parents
      </h1>
      <Link href={`/admin/puppies/${id}`} className="text-sm text-sage underline">
        ← Back to details
      </Link>

      <div className="mt-6">
        <ParentInfoForm
          puppyId={id}
          role="mom"
          data={{
            name: puppy.mom_name,
            breed: puppy.mom_breed,
            weight: puppy.mom_weight,
            registration: puppy.mom_registration,
            photoUrl: puppy.mom_photo_url,
          }}
        />
        <ParentInfoForm
          puppyId={id}
          role="dad"
          data={{
            name: puppy.dad_name,
            breed: puppy.dad_breed,
            weight: puppy.dad_weight,
            registration: puppy.dad_registration,
            photoUrl: puppy.dad_photo_url,
          }}
        />
      </div>
    </main>
  );
}