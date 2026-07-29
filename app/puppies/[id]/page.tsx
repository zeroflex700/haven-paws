import { notFound } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PuppyGallery from "../../components/PuppyGallery";
import InquiryForm from "../../components/InquiryForm";
import { getPuppyDetail } from "@/lib/queries/puppyDetail";

const statusColor: Record<string, string> = {
  available: "bg-gold text-forest",
  reserved: "bg-sage text-cream",
  sold: "border border-ink/40 text-ink/60",
};

export default async function PuppyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const puppy = await getPuppyDetail(id);

  if (!puppy) notFound();

  return (
    <main>
      <Navbar />
      <section className="max-w-5xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-10">
        <PuppyGallery media={puppy.media} name={puppy.name} />

        <div>
          <span
            className={`text-[10px] uppercase tracking-wider px-3 py-1 rounded-full ${statusColor[puppy.status]}`}
          >
            {puppy.status}
          </span>
          <h1 className="font-display text-3xl text-forest mt-3 mb-1">{puppy.name}</h1>
          <p className="eyebrow mb-4">{puppy.breed}</p>
          <div className="gold-rule mb-4" />

          <p className="text-2xl text-ink font-medium mb-6">
            ${puppy.price.toLocaleString()}
          </p>

          {puppy.description && (
            <p className="text-ink/80 mb-6 leading-relaxed">{puppy.description}</p>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm mb-8">
            <div>
              <p className="text-sage text-xs uppercase tracking-wider">Gender</p>
              <p className="text-ink capitalize">{puppy.sex}</p>
            </div>
            {puppy.color && (
              <div>
                <p className="text-sage text-xs uppercase tracking-wider">Color</p>
                <p className="text-ink">{puppy.color}</p>
              </div>
            )}
            {puppy.weightEstimate && (
              <div>
                <p className="text-sage text-xs uppercase tracking-wider">Est. Weight</p>
                <p className="text-ink">{puppy.weightEstimate} lbs</p>
              </div>
            )}
            <div>
              <p className="text-sage text-xs uppercase tracking-wider">Health</p>
              <p className="text-ink">
                {puppy.vetChecked ? "Vet Checked" : "Pending"} ·{" "}
                {puppy.vaccinated ? "Vaccinated" : "Pending"}
              </p>
            </div>
          </div>

          <InquiryForm puppyId={puppy.id} puppyName={puppy.name} />
        </div>
      </section>
      <Footer />
    </main>
  );
}