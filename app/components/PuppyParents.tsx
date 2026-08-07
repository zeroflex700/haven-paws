import OptimizedImage from "./OptimizedImage";
import type { ParentInfo } from "@/lib/queries/puppyDetail";

function ParentCard({ role, parent }: { role: string; parent: ParentInfo }) {
  if (!parent.name) return null;

  return (
    <div>
      {parent.photoUrl && (
        <div className="aspect-square rounded-lg overflow-hidden bg-cream-alt mb-3">
          <OptimizedImage src={parent.photoUrl} alt={parent.name} sizes="(max-width: 640px) 100vw, 45vw" />
        </div>
      )}
      <p className="eyebrow mb-1">{role}</p>
      <h3 className="h3 mb-2">{parent.name}</h3>
      <div className="text-sm text-ink/80 space-y-1">
        {parent.breed && <p>Breed: {parent.breed}</p>}
        {parent.weight && <p>Weight: {parent.weight}</p>}
        {parent.registration && <p>{parent.registration}</p>}
      </div>
    </div>
  );
}

export default function PuppyParents({
  puppyName,
  mom,
  dad,
}: {
  puppyName: string;
  mom: ParentInfo;
  dad: ParentInfo;
}) {
  if (!mom.name && !dad.name) return null;

  return (
    <section className="max-w-5xl mx-auto px-6 pb-16">
      <p className="eyebrow mb-3">Family</p>
      <h2 className="h2 mb-6">{puppyName}&apos;s Parents</h2>
      <div className="grid sm:grid-cols-2 gap-8">
        <ParentCard role="Mom" parent={mom} />
        <ParentCard role="Dad" parent={dad} />
      </div>
    </section>
  );
}