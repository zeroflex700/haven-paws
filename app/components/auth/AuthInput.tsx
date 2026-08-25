"use client";

import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  endAdornment?: ReactNode;
}

/**
 * AuthInput
 * ---------
 * Presentational only. This never intercepts value/onChange/required/
 * type/etc — every prop is spread straight onto the underlying <input>,
 * so the page's existing state and handlers work exactly as before.
 * The visible placeholder text passed in from the page is preserved;
 * `label` is used for the sr-only <label> and is not rendered visibly,
 * matching the original markup's accessibility pattern.
 */
const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, id, endAdornment, className = "", ...props }, ref) => {
    return (
      <div className="auth-input-group relative">
        <label htmlFor={id} className="sr-only">
          {label}
        </label>
        <input
          ref={ref}
          id={id}
          {...props}
          className={`peer w-full h-14 rounded-2xl border border-white/20 bg-white/[0.06] px-5 ${
            endAdornment ? "pr-14" : ""
          } text-[15px] text-white placeholder:text-white/45 backdrop-blur-sm outline-none transition-all duration-300 focus:border-gold/70 focus:bg-white/[0.09] focus-visible:ring-2 focus-visible:ring-gold/40 ${className}`}
        />
        <span
          aria-hidden="true"
          className="auth-input-underline pointer-events-none absolute left-5 right-5 bottom-0 h-px origin-left scale-x-0 bg-gold transition-transform duration-300 peer-focus:scale-x-100"
        />
        {endAdornment && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {endAdornment}
          </div>
        )}
      </div>
    );
  }
);

AuthInput.displayName = "AuthInput";

export default AuthInput;