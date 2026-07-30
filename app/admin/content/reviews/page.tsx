import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PageHeroVideoUploader from "../../components/PageHeroVideoUploader";

export default async function AdminReviewsContentPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("page_content")
    .select("hero_video_url")
    .eq("slug", "reviews")
    .single();

  return (
    <main className="px-5 pt-6 pb-10">
      <p className="eyebrow mb-1">Haven Paws Admin</p>
      <h1 className="font-display text-2xl text-forest mb-2">Reviews Page</h1>
      <p className="text-sm text-sage mb-4">
        Upload a hero video for the top of the reviews page. Manage individual reviews at{" "}
        <Link href="/admin/reviews" className="underline text-forest">
          /admin/reviews
        </Link>
        .
      </p>
      <PageHeroVideoUploader slug="reviews" currentUrl={data?.hero_video_url ?? null} />
    </main>
  );
}