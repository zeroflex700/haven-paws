"use client";

import type { ReactNode } from "react";

export default function AuthSocialButton({
  icon,
  label,
  onClick,
  disabled,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="auth-social-btn group relative w-full h-14 overflow-hidden rounded-full border border-white/20 bg-white/[0.05] flex items-center justify-center gap-3 text-[15px] font-medium text-white transition-colors duration-300 hover:border-gold/60 hover:bg-white/[0.09] disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span className="auth-social-sweep" aria-hidden="true" />
      <span className="relative z-10 flex items-center justify-center w-5 h-5">
        {icon}
      </span>
      <span className="relative z-10">{label}</span>

      <style jsx>{`
        .auth-social-btn {
          transform: translateZ(0);
        }
        .auth-social-btn:active {
          transform: scale(0.985);
        }
        .auth-social-sweep {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            100deg,
            transparent 30%,
            color-mix(in srgb, var(--color-gold-light) 16%, transparent) 50%,
            transparent 70%
          );
          transform: translateX(-120%);
        }
        .group:hover .auth-social-sweep {
          transform: translateX(120%);
          transition: transform 0.7s ease;
        }
        /*
         * No local prefers-reduced-motion override needed — globals.css
         * already forces transition durations to 0.01ms site-wide.
         */
      `}</style>
    </button>
  );
}