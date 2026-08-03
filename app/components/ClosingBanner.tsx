import { ProtectedImage } from "./ProtectedMedia";

export default function ClosingBanner({ image }: { image: string | null }) {
  return (
    <section className="bg-forest py-14">
      <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="font-display text-2xl text-cream mb-3">
            Everything you need, in one place
          </h2>
          <p className="text-cream/70">
            Browse, connect, and bring your puppy home — all from Haven Paws.
          </p>
        </div>
        {image && (
          <div className="aspect-video rounded-lg overflow-hidden">
            <ProtectedImage src={image} alt="Haven Paws" />
          </div>
        )}
      </div>
    </section>
  );
}