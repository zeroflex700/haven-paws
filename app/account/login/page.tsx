"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  PawPrint,
  Menu,
  Phone,
  User,
  Eye,
  EyeOff,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { getSafeRedirect } from "@/lib/auth/safe-redirect";
import GoogleAuthButton from "@/app/components/auth/GoogleAuthButton";

const RETURN_URL_KEY = "haven_paws_login_return_url";


export default function CustomerLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [redirectTo, setRedirectTo] = useState("/account");

  /*
   * Determine where the customer should go after login.
   *
   * Priority:
   *
   * 1. redirectTo query parameter
   * 2. previously saved page in sessionStorage
   * 3. /account
   */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const queryRedirect = params.get("redirectTo");

    if (queryRedirect) {
      const safeRedirect = getSafeRedirect(queryRedirect);

      setRedirectTo(safeRedirect);

      sessionStorage.setItem(
        RETURN_URL_KEY,
        safeRedirect
      );

      return;
    }

    const savedRedirect =
      sessionStorage.getItem(RETURN_URL_KEY);

    if (savedRedirect) {
      setRedirectTo(getSafeRedirect(savedRedirect));
    }
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      setLoading(false);
      setError("Incorrect email or password.");
      return;
    }

    const destination =
      getSafeRedirect(redirectTo);

    /*
     * Remove the saved login destination now that
     * authentication has succeeded.
     */
    sessionStorage.removeItem(RETURN_URL_KEY);

    setLoading(false);

    router.replace(destination);
    router.refresh();
  }

  async function handleOAuth(
    provider: "google" | "facebook"
  ) {
    setError("");

    const destination =
      getSafeRedirect(redirectTo);

    /*
     * Save it again so the destination survives
     * the external OAuth round-trip.
     */
    sessionStorage.setItem(
      RETURN_URL_KEY,
      destination
    );

    const callbackUrl = new URL(
      "/auth/callback",
      window.location.origin
    );

    callbackUrl.searchParams.set(
      "next",
      destination
    );

    const { error } =
      await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: callbackUrl.toString(),
        },
      });

    if (error) {
      setError(
        "Unable to continue with this login method."
      );
    }
  }

  return (
    <main className="min-h-screen bg-white text-ink">

      {/* HEADER */}
      <header className="border-b border-sage/20 bg-white">
        <div className="max-w-7xl mx-auto h-[76px] px-5 sm:px-6 lg:px-10 flex items-center justify-between">

          <div className="flex items-center">
            <button
              type="button"
              aria-label="Menu"
              className="p-2 -ml-2 text-forest hover:text-gold transition-colors md:hidden"
            >
              <Menu
                size={24}
                strokeWidth={1.7}
              />
            </button>
          </div>

          {/* LOGO */}
          <Link
            href="/"
            aria-label="Haven Paws home"
            className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2"
          >
            <PawPrint
              size={22}
              className="text-gold"
              strokeWidth={1.5}
            />

            <span className="font-display text-xl text-forest tracking-tight">
              Haven Paws
            </span>
          </Link>

          {/* RIGHT SIDE */}
          <div className="ml-auto flex items-center gap-3">

            <a
              href="tel:"
              aria-label="Call Haven Paws"
              className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full text-forest hover:text-gold transition-colors"
            >
              <Phone
                size={20}
                strokeWidth={1.7}
              />
            </a>

            <Link
              href="/account/login"
              aria-label="Account"
              className="w-9 h-9 rounded-full border border-sage/30 bg-cream-alt flex items-center justify-center text-forest hover:border-gold transition-colors"
            >
              <User
                size={17}
                strokeWidth={1.6}
              />
            </Link>

          </div>
        </div>
      </header>

      {/* LOGIN CONTENT */}
      <section className="px-5 sm:px-6 py-10 sm:py-14">
        <div className="w-full max-w-[590px] mx-auto">

          {/* TITLE */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <PawPrint
              size={24}
              className="text-gold"
              strokeWidth={1.5}
            />

            <h1 className="font-display text-2xl sm:text-3xl text-forest">
              Log in to Haven Paws
            </h1>
          </div>

          {/* SOCIAL LOGIN */}
          <div className="space-y-3">

            <GoogleAuthButton label="Continue with Google" nextPath={redirectTo} />

            <button
              type="button"
              onClick={() =>
                handleOAuth("facebook")
              }
              className="relative w-full h-14 border border-ink/40 rounded-full flex items-center justify-center text-sm sm:text-base font-medium text-ink hover:border-forest transition-colors"
            >
              <span className="absolute left-1/2 -translate-x-[115px] sm:-translate-x-[140px] w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center">
                <span className="text-xl font-bold leading-none">
                  f
                </span>
              </span>

              Continue with Facebook
            </button>

          </div>

          {/* DIVIDER */}
          <div className="flex items-center gap-4 my-7">
            <div className="flex-1 h-px bg-sage/25" />

            <span className="text-sm text-sage whitespace-nowrap">
              Or continue with email
            </span>

            <div className="flex-1 h-px bg-sage/25" />
          </div>

          {/* FORM */}
          <form onSubmit={handleLogin}>

            {/* EMAIL */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="sr-only"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                placeholder="Email*"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="w-full h-14 border border-ink/25 rounded-xl px-5 text-base text-ink placeholder:text-ink/50 bg-white focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest/20 transition-colors"
              />
            </div>

            {/* PASSWORD */}
            <div className="mb-4">
              <label
                htmlFor="password"
                className="sr-only"
              >
                Password
              </label>

              <div className="relative">

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  required
                  autoComplete="current-password"
                  placeholder="Password*"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  className="w-full h-14 border border-ink/25 rounded-xl pl-5 pr-14 text-base text-ink placeholder:text-ink/50 bg-white focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest/20 transition-colors"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (current) => !current
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/70 hover:text-forest transition-colors"
                >
                  {showPassword ? (
                    <EyeOff
                      size={22}
                      strokeWidth={1.7}
                    />
                  ) : (
                    <Eye
                      size={22}
                      strokeWidth={1.7}
                    />
                  )}
                </button>

              </div>
            </div>

            {/* REMEMBER / FORGOT */}
            <div className="flex items-center justify-between gap-4 mb-7 text-sm">

              <label className="flex items-center gap-3 text-ink/80 cursor-pointer">

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(
                      e.target.checked
                    )
                  }
                  className="sr-only peer"
                />

                <span className="w-5 h-5 rounded-md border border-ink/25 bg-white flex items-center justify-center peer-checked:bg-forest peer-checked:border-forest transition-colors">

                  {rememberMe && (
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      className="w-3.5 h-3.5 text-white"
                    >
                      <path
                        d="M4 10.5L8 14L16 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}

                </span>

                Remember me

              </label>

              <Link
                href="/account/forgot-password"
                className="text-forest font-medium underline underline-offset-2 hover:text-gold transition-colors whitespace-nowrap"
              >
                Forgot password?
              </Link>

            </div>

            {/* ERROR */}
            {error && (
              <p
                role="alert"
                className="text-sm text-red-600 mb-4"
              >
                {error}
              </p>
            )}

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-full bg-ink text-white text-base font-medium hover:bg-forest transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Logging in..."
                : "Log in"}
            </button>

          </form>

          {/* CREATE ACCOUNT */}
          <p className="text-center text-sm sm:text-base text-ink/75 mt-7">
            Don&apos;t have an account?{" "}

            <Link
              href="/account/signup"
              className="text-forest font-medium underline underline-offset-2 hover:text-gold transition-colors"
            >
              Create an account
            </Link>
          </p>

        </div>
      </section>
    </main>
  );
}