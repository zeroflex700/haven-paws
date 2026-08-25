"use client";

import { useAuthMotion } from "./AuthMotionProvider";

/**
 * AuthBackground
 * --------------
 * Pure decoration — no auth logic lives here. Renders the immersive
 * right-hand environment on desktop and a quieter top band on mobile.
 *
 * "login" reads as arrival/settling — the trail comes to rest near the
 * card. "signup" reads as departure/journey — the trail continues past
 * the card and a few loose paw marks trail off toward the edge.
 */
export default function AuthBackground({
  variant,
}: {
  variant: "login" | "signup";
}) {
  const motionEnabled = useAuthMotion();

  const trailPath =
    variant === "login"
      ? "M -40 420 C 120 380, 180 300, 260 260 C 360 210, 420 140, 520 110"
      : "M -40 120 C 100 160, 160 240, 260 270 C 380 300, 460 380, 560 460";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Base gradient wash — the site's own forest tones, never a made-up green */}
      <div
        className="absolute inset-0"
        style={{
          background:
            variant === "login"
              ? "radial-gradient(120% 100% at 78% 12%, var(--color-forest-light) 0%, var(--color-forest) 46%, color-mix(in srgb, var(--color-forest) 65%, black) 100%)"
              : "radial-gradient(120% 100% at 22% 90%, var(--color-forest-light) 0%, var(--color-forest) 46%, color-mix(in srgb, var(--color-forest) 65%, black) 100%)",
        }}
      />

      {/* Breathing blobs — slow, ambient, CSS-only */}
      <div
        className="auth-blob absolute w-[36rem] h-[36rem] rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--color-gold) 55%, transparent) 0%, transparent 70%)",
          top: variant === "login" ? "-8rem" : "auto",
          bottom: variant === "signup" ? "-10rem" : "auto",
          right: "-6rem",
          transform:
            "translate3d(calc((var(--pointer-x, 0.5) - 0.5) * -18px), calc((var(--pointer-y, 0.5) - 0.5) * -18px), 0)",
          animationDelay: "0s",
        }}
      />
      <div
        className="auth-blob-slow absolute w-[28rem] h-[28rem] rounded-full opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--color-sage) 50%, transparent) 0%, transparent 70%)",
          bottom: variant === "login" ? "-6rem" : "auto",
          top: variant === "signup" ? "-4rem" : "auto",
          left: "-6rem",
          transform:
            "translate3d(calc((var(--pointer-x, 0.5) - 0.5) * 12px), calc((var(--pointer-y, 0.5) - 0.5) * 12px), 0)",
          animationDelay: "2.4s",
        }}
      />

      {/* Signature element: a drawn paw-trail line, our one memorable flourish */}
      <svg
        viewBox="0 0 640 560"
        className="absolute inset-0 w-full h-full opacity-70"
        style={{
          transform:
            "translate3d(calc((var(--pointer-x, 0.5) - 0.5) * 8px), calc((var(--pointer-y, 0.5) - 0.5) * 8px), 0)",
        }}
      >
        <path
          d={trailPath}
          fill="none"
          stroke="var(--color-gold)"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="auth-trail-path"
        />
        {[0, 1, 2, 3].map((i) => {
          const t = variant === "login" ? 0.15 + i * 0.24 : 0.1 + i * 0.24;
          const x = 40 + t * 480;
          const y =
            variant === "login" ? 420 - t * 300 : 120 + t * 330;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={i === 3 ? 3.5 : 2.5}
              fill="var(--color-gold-light)"
              className="auth-trail-dot"
              style={{ animationDelay: `${0.4 + i * 0.18}s` }}
            />
          );
        })}
      </svg>

      {/* Subtle warm spotlight, desktop-only, follows the cursor */}
      {motionEnabled && (
        <div
          className="absolute inset-0 mix-blend-soft-light"
          style={{
            background:
              "radial-gradient(480px circle at calc(var(--pointer-x, 0.5) * 100%) calc(var(--pointer-y, 0.5) * 100%), color-mix(in srgb, var(--color-gold-light) 35%, transparent), transparent 60%)",
          }}
        />
      )}

      <style jsx>{`
        .auth-blob {
          animation: auth-breathe 9s ease-in-out infinite;
        }
        .auth-blob-slow {
          animation: auth-breathe 13s ease-in-out infinite;
        }
        .auth-trail-path {
          stroke-dasharray: 900;
          stroke-dashoffset: 900;
          animation: auth-draw 2.4s 0.2s cubic-bezier(0.65, 0, 0.35, 1) forwards;
        }
        .auth-trail-dot {
          opacity: 0;
          animation: auth-dot-in 0.6s ease-out forwards;
        }

        @keyframes auth-breathe {
          0%,
          100% {
            transform: scale(1) translate3d(0, 0, 0);
          }
          50% {
            transform: scale(1.08) translate3d(0, -8px, 0);
          }
        }
        @keyframes auth-draw {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes auth-dot-in {
          from {
            opacity: 0;
            transform: scale(0.4);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /*
         * No local prefers-reduced-motion override needed here — the
         * site's global globals.css already forces every animation
         * and transition duration to 0.01ms for reduced-motion users,
         * which effectively snaps these straight to their end state.
         */
      `}</style>
    </div>
  );
}