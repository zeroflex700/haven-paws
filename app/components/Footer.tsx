import HavenLogo from "./HavenLogo";
import SocialLinks from "./SocialLinks";
import FooterAccordion from "./FooterAccordion";
import SecurePaymentsRow from "./SecurePaymentsRow";
import { getSettings } from "@/lib/queries/settings";

export default async function Footer() {
  const settings = await getSettings();

  return (
    <footer className="bg-[#20364d] text-white border-t border-white/10">

      {/* Main footer identity */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-12">

        <div className="max-w-3xl mx-auto text-center">

          <div className="flex justify-center mb-5">
            <div className="
              w-16 h-16
              rounded-full
              bg-white/10
              border border-white/15
              flex items-center justify-center
              shadow-[0_12px_40px_rgba(0,0,0,0.12)]
            ">
              <HavenLogo size={44} />
            </div>
          </div>

          <h2 className="
            font-display
            text-2xl sm:text-3xl
            text-white
            tracking-tight
            mb-2
          ">
            {settings.breederName}
          </h2>

          <p className="
            text-[#f2d58e]
            text-[10px]
            uppercase
            tracking-[0.24em]
            font-medium
            mb-5
          ">
            {settings.tagline}
          </p>

          <p className="
            text-white/70
            text-sm
            leading-7
            max-w-xl
            mx-auto
            mb-9
          ">
            {settings.promiseText}
          </p>

          {settings.supportPhone && (
            <div className="
              inline-flex
              flex-col
              items-center
              px-7 py-4
              rounded-2xl
              bg-white/[0.06]
              border border-white/10
              mb-9
            ">
              <p className="text-[11px] text-white/50 mb-1">
                Need guidance?
              </p>

              <a
                href={`tel:${settings.supportPhone}`}
                className="
                  text-base
                  font-medium
                  text-white
                  hover:text-[#f2d58e]
                  transition-colors
                "
              >
                {settings.supportPhone}
              </a>

              {settings.supportHours && (
                <p className="text-xs text-white/50 mt-1">
                  {settings.supportHours}
                </p>
              )}
            </div>
          )}

          <p className="text-[10px] uppercase tracking-[0.2em] text-white/45 mb-4">
            Follow us
          </p>

          <div className="flex justify-center">
            <SocialLinks
              facebookUrl={settings.facebookUrl}
              instagramUrl={settings.instagramUrl}
              youtubeUrl={settings.youtubeUrl}
              twitterUrl={settings.twitterUrl}
            />
          </div>
        </div>
      </div>

      {/* Existing navigation */}
      <div className="border-t border-white/10">
        <FooterAccordion />
      </div>

      {/* Payments */}
      <div className="border-t border-white/10 bg-[#1b3045]">
        <SecurePaymentsRow />
      </div>

      {/* Legal */}
      <div className="border-t border-white/10">
        <div className="
          max-w-7xl
          mx-auto
          px-6 lg:px-10
          py-6
          flex flex-col md:flex-row
          justify-between
          items-center
          gap-3
          text-xs
          text-white/45
        ">
          <p>hello@havenpaws.com</p>

          <p>
            © {new Date().getFullYear()} {settings.breederName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}