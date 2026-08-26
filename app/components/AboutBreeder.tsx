import { ShieldCheck, Award, PawPrint } from "lucide-react";
import type { AppSettings } from "@/lib/queries/settings";

export default function AboutBreeder({ settings }: { settings: AppSettings }) {
  if (!settings.bio && !settings.yearsExperience) return null;

  return (
    <section className="bg-gradient-to-b from-cream-alt to-cream py-20">
      <div className="max-w-3xl mx-auto px-6">
        <p className="eyebrow mb-3 text-center">About the Breeder</p>
        <h2 className="font-display text-3xl sm:text-4xl text-forest mb-10 text-center tracking-tight">
          Raised by {settings.breederName}
        </h2>

        <div className="relative rounded-[2rem] border border-sage/15 bg-white p-8 sm:p-12 shadow-[0_25px_70px_rgba(24,46,35,0.08)]">

          {/* Large photo, anchored and overlapping the top of the card */}
          <div className="flex justify-center -mt-20 sm:-mt-24 mb-6">
            <div className="relative">
              <div className="h-36 w-36 sm:h-44 sm:w-44 rounded-full overflow-hidden border-[6px] border-white shadow-[0_15px_40px_rgba(24,46,35,0.18)] bg-cream-alt">
                {settings.breederPhotoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={settings.breederPhotoUrl}
                    alt={settings.breederName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-forest/25">
                    <PawPrint size={48} strokeWidth={1.3} />
                  </div>
                )}
              </div>

              {settings.badgeText && (
                <div className="absolute -bottom-1.5 -right-1.5 flex h-11 w-11 items-center justify-center rounded-full bg-gold text-forest shadow-md ring-4 ring-white">
                  <Award size={18} strokeWidth={2} />
                </div>
              )}
            </div>
          </div>

          <div className="text-center">
            <h3 className="font-display text-xl sm:text-2xl text-forest">
              {settings.breederName}
            </h3>

            {settings.badgeText && (
              <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-gold">
                <Award size={13} strokeWidth={2} />
                {settings.badgeText}
              </p>
            )}
          </div>

          {settings.bio && (
            <p className="mt-6 text-center text-ink/75 leading-relaxed max-w-xl mx-auto">
              {settings.bio}
            </p>
          )}

          {(settings.yearsExperience || settings.specialties) && (
            <div className="mt-8 grid gap-3 sm:grid-cols-2 border-t border-sage/10 pt-6">
              {settings.yearsExperience && (
                <div className="flex items-center gap-3 rounded-2xl bg-cream-alt/60 px-4 py-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-gold shadow-sm">
                    <ShieldCheck size={17} strokeWidth={1.7} />
                  </span>
                  <span className="text-sm text-ink/80">
                    {settings.yearsExperience}
                  </span>
                </div>
              )}

              {settings.specialties && (
                <div className="flex items-center gap-3 rounded-2xl bg-cream-alt/60 px-4 py-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-gold shadow-sm">
                    <PawPrint size={17} strokeWidth={1.7} />
                  </span>
                  <span className="text-sm text-ink/80">
                    Specializes in {settings.specialties}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}