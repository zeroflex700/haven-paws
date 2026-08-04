import { SCORECARD_FIELDS, AT_A_GLANCE_KEYS } from "@/lib/breedGuideFields";

export default function BreedGuideAtAGlance({ scorecard }: { scorecard: Record<string, string> }) {
  const items = AT_A_GLANCE_KEYS.map((key) => SCORECARD_FIELDS.find((f) => f.key === key)).filter(
    (f): f is NonNullable<typeof f> => !!f && !!scorecard[f.key]
  );

  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-8">
      {items.map((field) => (
        <div key={field.key} className="bg-cream-alt rounded-lg p-4">
          <p className="font-display text-lg text-forest">
            {field.type === "score" ? `${scorecard[field.key]}/5` : scorecard[field.key]}
          </p>
          <p className="text-xs text-sage">{field.label}</p>
          {field.type === "score" && (
            <div className="w-full h-1.5 bg-white rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-gold"
                style={{ width: `${(Number(scorecard[field.key]) / 5) * 100}%` }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}