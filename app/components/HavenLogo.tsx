export default function HavenLogo({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Roofline formed by three paw toes */}
      <circle cx="14" cy="14" r="5" className="fill-gold" />
      <circle cx="24" cy="9" r="5.5" className="fill-gold" />
      <circle cx="34" cy="14" r="5" className="fill-gold" />
      {/* House body formed by the paw pad */}
      <path
        d="M12 22C12 19.2 15.8 17 24 17C32.2 17 36 19.2 36 22V36C36 38.2 34.2 40 32 40H16C13.8 40 12 38.2 12 36V22Z"
        className="fill-forest"
      />
      {/* Door / window notch */}
      <rect x="20" y="28" width="8" height="12" rx="2" className="fill-cream" />
    </svg>
  );
}