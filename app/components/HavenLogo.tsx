export default function HavenLogo({
  size = 40,
}: {
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Paw toes */}
      <circle
        cx="14"
        cy="14"
        r="5"
        fill="#D9B75D"
      />

      <circle
        cx="24"
        cy="9"
        r="5.5"
        fill="#D9B75D"
      />

      <circle
        cx="34"
        cy="14"
        r="5"
        fill="#D9B75D"
      />

      {/* Paw / house body */}
      <path
        d="M12 22C12 19.2 15.8 17 24 17C32.2 17 36 19.2 36 22V36C36 38.2 34.2 40 32 40H16C13.8 40 12 38.2 12 36V22Z"
        fill="#F7F3E8"
      />

      {/* Door */}
      <rect
        x="20"
        y="28"
        width="8"
        height="12"
        rx="2"
        fill="#183447"
      />

      {/* Small door highlight */}
      <circle
        cx="26"
        cy="34"
        r="0.9"
        fill="#D9B75D"
      />
    </svg>
  );
}