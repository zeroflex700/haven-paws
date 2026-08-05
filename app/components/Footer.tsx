import HavenLogo from "./HavenLogo";
import SocialLinks from "./SocialLinks";
import FooterAccordion from "./FooterAccordion";
import SecurePaymentsRow from "./SecurePaymentsRow";
import { getSettings } from "@/lib/queries/settings";

export default async function Footer() {
  const settings = await getSettings();

  return (
    <footer className="bg-cream-alt text-ink border-t border-sage/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-12 pb-8 text-center">
        <div className="flex justify-center mb-3">
          <HavenLogo size={44} />
        </div>
        <h2 className="font-display text-xl text-forest mb-1">{settings.breederName}</h2>
        <p className="text-gold text-xs uppercase tracking-[0.15em] mb-4">
          {settings.tagline}
        </p>
        <p className="text-ink/70 text-sm leading-relaxed max-w-lg mx-auto mb-8">
          {settings.promiseText}
        </p>

        {settings.supportPhone && (
          <div className="mb-6">
            <p className="text-xs text-ink/60 mb-1">Need guidance?</p>
            <a href={`tel:${settings.supportPhone}`} className="text-base font-medium text-forest underline">
              {settings.supportPhone}
            </a>
            {settings.supportHours && (
              <p className="text-xs text-ink/60 mt-1">{settings.supportHours}</p>
            )}
          </div>
        )}

        <p className="text-xs text-ink/60 mb-3">Follow us</p>
        <div className="flex justify-center">
          <SocialLinks
            facebookUrl={settings.facebookUrl}
            instagramUrl={settings.instagramUrl}
            youtubeUrl={settings.youtubeUrl}
            twitterUrl={settings.twitterUrl}
          />
        </div>
      </div>

      <FooterAccordion />
      <SecurePaymentsRow />

      <div className="border-t border-sage/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-ink/60">
          <p>hello@havenpaws.com</p>
          <p>© {new Date().getFullYear()} {settings.breederName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}