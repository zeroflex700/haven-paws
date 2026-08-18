import HavenLogo from "./HavenLogo";
import SocialLinks from "./SocialLinks";
import FooterAccordion from "./FooterAccordion";
import SecurePaymentsRow from "./SecurePaymentsRow";
import { getSettings } from "@/lib/queries/settings";

export default async function Footer() {
  const settings = await getSettings();

  return (
    <footer className="relative overflow-hidden bg-[#142B3D] text-white">
      {/* Decorative background atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-32 -right-32 h-72 w-72 rounded-full bg-[#D9B75D]/8 blur-3xl" />
        <div className="absolute top-72 -left-40 h-80 w-80 rounded-full bg-[#6FA8C5]/8 blur-3xl" />
      </div>

      {/* =========================================================
          BRAND / PROMISE AREA
      ========================================================== */}
      <div className="relative border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-10 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-2xl">
              {/* Brand mark */}
              <div className="mb-7 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#D9B75D]/30 bg-[#D9B75D]/10 shadow-[0_12px_35px_rgba(0,0,0,0.14)]">
                  <HavenLogo size={42} />
                </div>

                <div>
                  <h2 className="font-display text-2xl tracking-tight text-[#FFFDF7] sm:text-3xl">
                    {settings.breederName}
                  </h2>

                  <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.24em] text-[#D9B75D]">
                    {settings.tagline}
                  </p>
                </div>
              </div>

              {/* Promise */}
              <p className="max-w-xl text-base leading-8 text-white/72 sm:text-lg">
                {settings.promiseText}
              </p>
            </div>

            {/* Support card */}
            {settings.supportPhone && (
              <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#203B51] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.12)] lg:min-w-[300px]">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#91B9CF]">
                  Need guidance?
                </p>

                <a
                  href={`tel:${settings.supportPhone}`}
                  className="inline-block text-lg font-medium text-white underline decoration-[#D9B75D]/70 underline-offset-4 transition-colors hover:text-[#D9B75D]"
                >
                  {settings.supportPhone}
                </a>

                {settings.supportHours && (
                  <p className="mt-2 text-xs leading-5 text-white/50">
                    {settings.supportHours}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Social area */}
          <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#91B9CF]">
                Follow us
              </p>
            </div>

            <SocialLinks
              facebookUrl={settings.facebookUrl}
              instagramUrl={settings.instagramUrl}
              youtubeUrl={settings.youtubeUrl}
              twitterUrl={settings.twitterUrl}
            />
          </div>
        </div>
      </div>

      {/* =========================================================
          NAVIGATION AREA
      ========================================================== */}
      <div className="relative border-b border-white/10 bg-[#1B354B]">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <div className="py-2">
            <FooterAccordion />
          </div>
        </div>
      </div>

      {/* =========================================================
          SECURE PAYMENTS
      ========================================================== */}
      <div className="relative border-b border-white/10 bg-[#102638]">
        <SecurePaymentsRow />
      </div>

      {/* =========================================================
          COPYRIGHT
      ========================================================== */}
      <div className="relative bg-[#F5F2EA] text-[#183447]">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-5 text-center sm:px-8 md:flex-row md:items-center md:justify-between md:text-left lg:px-10">
          <p className="text-xs font-medium text-[#183447]/70">
            hello@havenpaws.com
          </p>

          <p className="text-xs text-[#183447]/55">
            © {new Date().getFullYear()} {settings.breederName}. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}