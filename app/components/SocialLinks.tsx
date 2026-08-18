function FacebookIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.9 2H22l-7.6 8.7L23.3 22h-7.1l-5.5-7.2L4.4 22H1.3l8.1-9.3L1 2h7.3l5 6.6zm-1.2 18h1.7L6.4 4H4.6z" />
    </svg>
  );
}

export default function SocialLinks({
  facebookUrl,
  instagramUrl,
  youtubeUrl,
  twitterUrl,
}: {
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  twitterUrl: string;
}) {
  const links = [
    {
      url: facebookUrl,
      Icon: FacebookIcon,
      label: "Facebook",
    },
    {
      url: instagramUrl,
      Icon: InstagramIcon,
      label: "Instagram",
    },
    {
      url: youtubeUrl,
      Icon: YoutubeIcon,
      label: "YouTube",
    },
    {
      url: twitterUrl,
      Icon: XIcon,
      label: "X",
    },
  ];

  return (
    <div className="flex items-center gap-2.5">
      {links.map(({ url, Icon, label }) => (
        <a
          key={label}
          href={url || "#"}
          target={url ? "_blank" : undefined}
          rel={url ? "noopener noreferrer" : undefined}
          aria-label={label}
          className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.07] text-white/80 shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-200 hover:-translate-y-1 hover:border-[#D9B75D]/50 hover:bg-[#D9B75D] hover:text-[#183447] active:translate-y-0"
        >
          <Icon />
        </a>
      ))}
    </div>
  );
}