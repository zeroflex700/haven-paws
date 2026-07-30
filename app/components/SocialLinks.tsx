import { Facebook, Instagram, Youtube, Twitter } from "lucide-react";

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
    { url: facebookUrl, icon: Facebook, label: "Facebook" },
    { url: instagramUrl, icon: Instagram, label: "Instagram" },
    { url: youtubeUrl, icon: Youtube, label: "YouTube" },
    { url: twitterUrl, icon: Twitter, label: "X" },
  ];

  return (
    <div className="flex items-center gap-3">
      {links.map(({ url, icon: Icon, label }) => (
        <a
          key={label}
          href={url || "#"}
          target={url ? "_blank" : undefined}
          rel="noopener noreferrer"
          aria-label={label}
          className="w-9 h-9 rounded-full bg-forest-light flex items-center justify-center hover:bg-gold transition-colors"
        >
          <Icon size={16} className="text-cream" />
        </a>
      ))}
    </div>
  );
}