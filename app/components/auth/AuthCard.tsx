"use client";

import { useAuthMotion } from "./AuthMotionProvider";

/**
 * AuthCard
 * --------
 * Presentational only. Wraps the login/signup form in a multi-layer
 * frosted-glass panel with two faint offset "stacked paper" layers
 * behind it, and — on qualifying desktop devices only — a restrained
 * cursor-driven tilt. Everything here reads --pointer-x/--pointer-y
 * from AuthMotionProvider; there is no independent event listener.
 */
export default function AuthCard({
  children,
}: {
  children: React.ReactNode;
}) {
  const motionEnabled = useAuthMotion();

  return (
    <div
      className="relative w-full max-w-[440px]"
      style={{ perspective: motionEnabled ? "1400px" : undefined }}
    >
      {/* Stacked paper layers — subtle depth behind the card */}
      <div className="auth-stack-layer absolute inset-0 translate-x-3 translate-y-4 rounded-[28px] bg-[#f4e3b8]/25 border border-[#f4e3b8]/20" />
      <div className="auth-stack-layer absolute inset-0 translate-x-1.5 translate-y-2 rounded-[28px] bg-white/10 border border-white/10" />

      <div
        className="auth-card relative rounded-[28px] border border-white/15 bg-white/[0.07] backdrop-blur-2xl shadow-[0_30px_80px_-20px_rgba(10,25,20,0.55)] px-7 py-9 sm:px-10 sm:py-11"
        style={
          motionEnabled
            ? {
                transform:
                  "rotateY(calc((var(--pointer-x, 0.5) - 0.5) * 6deg)) rotateX(calc((var(--pointer-y, 0.5) - 0.5) * -6deg))",
                transformStyle: "preserve-3d",
              }
            : undefined
        }
      >
        {/* Inner highlight border for glass readability */}
        <div className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-inset ring-white/10" />
        <div className="relative">{children}</div>
      </div>

      <style jsx>{`
        .auth-card {
          animation: auth-card-settle 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
          transition: transform 0.15s ease-out;
        }
        .auth-stack-layer {
          animation: auth-card-settle 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: 0.05s;
        }
        @keyframes auth-card-settle {
          from {
            opacity: 0;
            transform: translateY(18px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .auth-card,
          .auth-stack-layer {
            animation: none;
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}
