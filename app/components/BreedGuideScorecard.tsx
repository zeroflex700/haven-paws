import { SCORECARD_FIELDS, SCORECARD_GROUPS } from "@/lib/breedGuideFields";

export default function BreedGuideScorecard({ scorecard }: { scorecard: Record<string, string> }) {
  return (
    <div>
      {SCORECARD_GROUPS.map((group) => {
        const fields = SCORECARD_FIELDS.filter((f) => f.group === group && scorecard[f.key]);
        if (fields.length === 0) return null;
        return (
          <div key={group} className="mb-6">
            <p className="font-display text-lg text-forest mb-2">{group}</p>
            {fields.map((f) => (
              <div key={f.key} className="flex justify-between py-2 border-b border-sage/10 text-sm">
                <span className="text-ink/70">{f.label}</span>
                <span className="text-ink font-medium">
                  {f.type === "score" ? `${scorecard[f.key]}/5` : scorecard[f.key]}
                </span>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}