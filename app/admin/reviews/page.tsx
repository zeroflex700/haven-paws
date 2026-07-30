import Link from "next/link";
import { getAllReviewsAdmin } from "@/lib/queries/testimonials";
import DeleteReviewButton from "../components/DeleteReviewButton";

export default async function AdminReviewsPage() {
  const reviews = await getAllReviewsAdmin();

  return (
    <main className="px-5 pt-6 pb-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="eyebrow mb-1">Haven Paws Admin</p>
          <h1 className="font-display text-2xl text-forest">Reviews</h1>
        </div>
        <Link
          href="/admin/reviews/new"
          className="bg-forest text-cream text-sm px-4 py-2 rounded-full hover:bg-forest-light"
        >
          + Add
        </Link>
      </div>

      {reviews.length === 0 ? (
        <p className="text-sage">No reviews yet.</p>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white border border-sage/20 rounded-lg p-4">
              <div className="flex justify-between items-start mb-1">
                <p className="text-forest font-medium">{r.customerName}</p>
                {r.isSpotlight && (
                  <span className="text-[10px] uppercase tracking-wider bg-gold text-forest px-2 py-0.5 rounded-full">
                    Spotlight
                  </span>
                )}
              </div>
              <p className="text-xs text-sage mb-2">
                {r.rating}★ {r.location ? `· ${r.location}` : ""}
              </p>
              <p className="text-sm text-ink/70 line-clamp-2 mb-3">{r.reviewText}</p>
              <div className="flex gap-3">
                <Link
                  href={`/admin/reviews/${r.id}`}
                  className="text-sm text-forest border-b border-gold pb-0.5"
                >
                  Edit
                </Link>
                <DeleteReviewButton id={r.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}