import { ShieldCheck, Award, PawPrint } from "lucide-react";
import type { AppSettings } from "@/lib/queries/settings";

export default function AboutBreeder({ settings }: { settings: AppSettings }) {
  if (!settings.bio && !settings.yearsExperience) return null;

  return (
    <section className="bg-cream-alt py-16">
      <div className="max-w-3xl mx-auto px-6">
        <p className="eyebrow mb-3">About the Breeder</p>
        <h2 className="font-display text-2xl text-forest mb-6">
          Raised by {settings.breederName}
        </h2>

        <div className="bg-white rounded-lg border border-sage/20 p-6">
          {settings.badgeText && (
            <div className="flex items-center gap-2 mb-4 text-gold">
              <Award size={18} strokeWidth={1.5} />
              <span className="text-sm font-medium">{settings.badgeText}</span>
            </div>
          )}

          {settings.bio && (
            <p className="text-ink/80 leading-relaxed mb-4">{settings.bio}</p>
          )}

          <div className="space-y-2 text-sm text-ink/80">
            {settings.yearsExperience && (
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-gold shrink-0" strokeWidth={1.5} />
                {settings.yearsExperience}
              </div>
            )}
            {settings.specialties && (
              <div className="flex items-center gap-2">
                <PawPrint size={16} className="text-gold shrink-0" strokeWidth={1.5} />
                Breed specialization: {settings.specialties}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}