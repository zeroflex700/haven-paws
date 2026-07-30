import { getReviewAdmin } from "@/lib/queries/testimonials";
import ReviewForm from "../../components/ReviewForm";
import { notFound } from "next/navigation";

export default async function EditReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const review = await getReviewAdmin(id);

  if (!review) notFound();

  return (
    <main className="px-5 pt-6">
      <p className="eyebrow mb-1">Haven Paws Admin</p>
      <h1 className="font-display text-2xl text-forest mb-6">Edit Review</h1>
      <ReviewForm review={review} />
    </main>
  );
}