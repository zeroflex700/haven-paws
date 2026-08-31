import Link from "next/link";
import { getPuppyMedia } from "@/lib/queries/media";
import { createClient } from "@/lib/supabase/server";
import MediaUploader from "../../../components/MediaUploader";
import MediaGallery from "../../../components/MediaGallery";
import { notFound } from "next/navigation";

export default async function PuppyMediaPage({
params,
}: {
params: Promise<{ id: string }>;
}) {
const { id } = await params;
const supabase = await createClient();

const { data: puppy } = await supabase
.from("puppies")
.select("name")
.eq("id", id)
.single();

if (!puppy) notFound();

const media = await getPuppyMedia(id);

return (
<main className="px-5 pt-6">
<p className="eyebrow mb-1">Haven Paws Admin</p>
<h1 className="font-display text-2xl text-forest mb-1">
  {puppy.name}&apos;s Media
</h1>
<Link
  href={`/admin/puppies/${id}`}
  className="text-sm text-sage underline"
>
← Back to details
</Link>

<div className="mt-6">
<MediaUploader puppyId={id} />
<MediaGallery puppyId={id} media={media} />
</div>
</main>
);
}