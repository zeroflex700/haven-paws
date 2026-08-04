import { ProtectedImage } from "./ProtectedMedia";

export default function BreedGuideArticleSection({
  summary,
  body,
  image,
  credit,
}: {
  summary: string;
  body: string;
  image?: string | null;
  credit?: string | null;
}) {
  return (
    <div className="grid sm:grid-cols-2 gap-6 py-8 border-b border-sage/10">
      <p className="font-display text-xl text-forest leading-snug">{summary}</p>
      <div>
        <p className="text-ink/80 leading-relaxed whitespace-pre-line">{body}</p>
        {image && (
          <div className="mt-4">
            <div className="aspect-video rounded-lg overflow-hidden">
              <ProtectedImage src={image} alt={summary} />
            </div>
            {credit && <p className="text-xs text-sage mt-1">{credit}</p>}
          </div>
        )}
      </div>
    </div>
  );
}