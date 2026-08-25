"use client";

/**
 * AuthHeading
 * -----------
 * Presentational only. Splits a heading into words for a staggered,
 * blur-to-sharp entrance. The visible spans are aria-hidden and the
 * <h1> carries the full string as its accessible name, so this never
 * fragments the heading for screen reader or reduced-motion users.
 */
export default function AuthHeading({
  eyebrow,
  text,
}: {
  eyebrow?: string;
  text: string;
}) {
  const words = text.split(" ");

  return (
    <div className="mb-1">
      {eyebrow && (
        <p className="auth-eyebrow text-[11px] uppercase tracking-[0.22em] text-gold-light mb-2">
          {eyebrow}
        </p>
      )}
      <h1
        aria-label={text}
        className="font-display text-[28px] sm:text-[34px] leading-[1.12] text-white"
      >
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            aria-hidden="true"
            className="auth-word inline-block"
            style={{ animationDelay: `${0.15 + i * 0.07}s` }}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </span>
        ))}
      </h1>

      <style jsx>{`
        .auth-word {
          opacity: 0;
          filter: blur(6px);
          transform: translateY(10px);
          animation: auth-word-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .auth-eyebrow {
          opacity: 0;
          animation: auth-word-in 0.5s ease-out forwards;
        }
        @keyframes auth-word-in {
          to {
            opacity: 1;
            filter: blur(0);
            transform: translateY(0);
          }
        }
        /*
         * No local prefers-reduced-motion override needed — globals.css
         * already forces animation durations to 0.01ms site-wide.
         */
      `}</style>
    </div>
  );
}