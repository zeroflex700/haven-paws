import ReviewForm from "../../components/ReviewForm";

export default function NewReviewPage() {
  return (
    <main className="px-5 pt-6">
      <p className="eyebrow mb-1">Haven Paws Admin</p>
      <h1 className="font-display text-2xl text-forest mb-6">Add a Review</h1>
      <ReviewForm />
    </main>
  );
}