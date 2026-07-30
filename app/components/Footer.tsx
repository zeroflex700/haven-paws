import HavenLogo from "./HavenLogo";
import SocialLinks from "./SocialLinks";
import { getSettings } from "@/lib/queries/settings";

export default async function Footer() {
  const settings = await getSettings();

  return (
    <footer className="bg-forest text-cream">
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <div className="flex justify-center mb-4">
          <HavenLogo size={56} />
        </div>
        <h2 className="font-display text-2xl mb-1">{settings.breederName}</h2>
        <p className="text-gold text-sm uppercase tracking-[0.15em] mb-6">
          {settings.tagline}
        </p>
        <p className="text-cream/80 leading-relaxed max-w-lg mx-auto mb-10">
          {settings.promiseText}
        </p>

        {settings.supportPhone && (
          <div className="mb-8">
            <p className="text-sm text-cream/60 mb-1">Need guidance?</p>
            <a href={`tel:${settings.supportPhone}`} className="text-lg font-medium underline">
              {settings.supportPhone}
            </a>
            {settings.supportHours && (
              <p className="text-xs text-cream/60 mt-1">{settings.supportHours}</p>
            )}
          </div>
        )}

        <p className="text-sm text-cream/60 mb-3">Follow us</p>
        <div className="flex justify-center">
          <SocialLinks
            facebookUrl={settings.facebookUrl}
            instagramUrl={settings.instagramUrl}
            youtubeUrl={settings.youtubeUrl}
            twitterUrl={settings.twitterUrl}
          />
        </div>
      </div>

      <div className="border-t border-forest-light">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-cream/60">
          <p>hello@havenpaws.com</p>
          <p>© {new Date().getFullYear()} {settings.breederName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}