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
      {/* Base gradient wash — warm cream into deep forest, never cold */}
      <div
        className="absolute inset-0"
        style={{
          background:
            variant === "login"
              ? "radial-gradient(120% 100% at 78% 12%, #2a4f46 0%, #193b35 46%, #12281f 100%)"
              : "radial-gradient(120% 100% at 22% 90%, #2a4f46 0%, #193b35 46%, #12281f 100%)",
        }}
      />

      {/* Breathing blobs — slow, ambient, CSS-only */}
      <div
        className="auth-blob absolute w-[36rem] h-[36rem] rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(215,169,75,0.55) 0%, rgba(215,169,75,0) 70%)",
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
            "radial-gradient(circle, rgba(142,165,143,0.5) 0%, rgba(142,165,143,0) 70%)",
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
          stroke="#d7a94b"
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
              fill="#f4e3b8"
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
              "radial-gradient(480px circle at calc(var(--pointer-x, 0.5) * 100%) calc(var(--pointer-y, 0.5) * 100%), rgba(244,227,184,0.35), transparent 60%)",
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

        @media (prefers-reduced-motion: reduce) {
          .auth-blob,
          .auth-blob-slow {
            animation: none;
          }
          .auth-trail-path {
            stroke-dashoffset: 0;
            animation: none;
          }
          .auth-trail-dot {
            opacity: 1;
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
