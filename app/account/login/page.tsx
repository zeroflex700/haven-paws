"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  Phone,
  UserCircle,
  PawPrint,
  Eye,
  EyeOff,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export default function CustomerLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError("Incorrect email or password.");
      return;
    }

    router.push("/account");
    router.refresh();
  }

  async function handleOAuth(provider: "google" | "facebook") {
    setError("");

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/account`,
      },
    });

    if (error) {
      setError("Unable to continue. Please try again.");
    }
  }

  return (
    <main className="min-h-screen bg-white text-ink">
      {/* =========================================================
          HEADER
      ========================================================== */}
      <header className="h-[88px] border-b border-sage/10 bg-white">
        <div className="relative h-full max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between">
          {/* LEFT — MENU */}
          <button
            type="button"
            aria-label="Open menu"
            className="flex items-center justify-center w-10 h-10 text-forest hover:text-gold transition-colors"
          >
            <Menu size={28} strokeWidth={1.8} />
          </button>

          {/* CENTER — LOGO */}
          <Link
            href="/"
            aria-label="Haven Paws home"
            className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2.5"
          >
            <PawPrint
              size={30}
              className="text-gold"
              strokeWidth={1.5}
            />

            <span className="font-display text-[28px] text-forest tracking-tight whitespace-nowrap">
              Haven Paws
            </span>
          </Link>

          {/* RIGHT — CONTACT + ACCOUNT */}
          <div className="ml-auto flex items-center gap-5">
            <a
              href="tel:+18005550199"
              aria-label="Call Haven Paws"
              className="hidden sm:flex items-center justify-center text-forest hover:text-gold transition-colors"
            >
              <Phone size={25} strokeWidth={1.8} />
            </a>

            <Link
              href="/account/login"
              aria-label="Account"
              className="flex items-center justify-center text-forest hover:text-gold transition-colors"
            >
              <UserCircle size={30} strokeWidth={1.6} />
            </Link>
          </div>
        </div>
      </header>

      {/* =========================================================
          LOGIN CONTENT
      ========================================================== */}
      <section className="min-h-[calc(100vh-88px)] flex justify-center px-5 sm:px-6 py-10 sm:py-14">
        <div className="w-full max-w-[590px]">
          {/* TITLE */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <PawPrint
              size={35}
              className="text-gold"
              strokeWidth={1.5}
            />

            <h1 className="font-display text-[27px] sm:text-[30px] text-forest font-medium">
              Log in to Haven Paws
            </h1>
          </div>

          {/* SOCIAL LOGIN */}
          <div className="space-y-4">
            {/* GOOGLE */}
            <button
              type="button"
              onClick={() => handleOAuth("google")}
              className="w-full h-[64px] rounded-full border border-ink/50 bg-white flex items-center justify-center gap-4 text-[18px] sm:text-[20px] font-semibold text-ink hover:border-forest hover:bg-cream-alt/30 active:scale-[0.99] transition-all"
            >
              <span
                aria-hidden="true"
                className="text-[27px] font-semibold leading-none"
              >
                G
              </span>

              <span>Continue with Google</span>
            </button>

            {/* FACEBOOK */}
            <button
              type="button"
              onClick={() => handleOAuth("facebook")}
              className="w-full h-[64px] rounded-full border border-ink/50 bg-white flex items-center justify-center gap-4 text-[18px] sm:text-[20px] font-semibold text-ink hover:border-forest hover:bg-cream-alt/30 active:scale-[0.99] transition-all"
            >
              <span
                aria-hidden="true"
                className="w-[31px] h-[31px] rounded-full bg-[#1877F2] text-white flex items-center justify-center text-[27px] font-bold leading-none"
              >
                f
              </span>

              <span>Continue with Facebook</span>
            </button>
          </div>

          {/* DIVIDER */}
          <div className="flex items-center gap-4 my-7">
            <div className="flex-1 h-px bg-sage/25" />

            <span className="text-[16px] text-ink/45 whitespace-nowrap">
              Or continue with email
            </span>

            <div className="flex-1 h-px bg-sage/25" />
          </div>

          {/* ERROR */}
          {error && (
            <div
              role="alert"
              className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {/* EMAIL LOGIN */}
          <form onSubmit={handleLogin}>
            {/* EMAIL */}
            <div className="mb-4">
              <label htmlFor="email" className="sr-only">
                Email
              </label>

              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                placeholder="Email*"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-[64px] rounded-[17px] border border-ink/25 bg-white px-7 text-[19px] text-ink placeholder:text-ink/45 focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest transition-all"
              />
            </div>

            {/* PASSWORD */}
            <div className="mb-5 relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="Password*"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-[64px] rounded-[17px] border border-ink/25 bg-white px-7 pr-16 text-[19px] text-ink placeholder:text-ink/45 focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest transition-all"
              />

              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
                className="absolute right-5 top-1/2 -translate-y-1/2 text-ink/70 hover:text-forest transition-colors"
              >
                {showPassword ? (
                  <EyeOff size={27} strokeWidth={1.8} />
                ) : (
                  <Eye size={27} strokeWidth={1.8} />
                )}
              </button>
            </div>

            {/* REMEMBER + FORGOT */}
            <div className="flex items-center justify-between gap-4 mb-8">
              <label className="flex items-center gap-3 text-[17px] text-ink/80 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="appearance-none w-[24px] h-[24px] rounded-[5px] border border-ink/25 bg-white checked:bg-forest checked:border-forest relative cursor-pointer
                    after:content-['✓'] after:absolute after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:text-white after:text-[15px] after:font-bold after:opacity-0 checked:after:opacity-100"
                />

                <span>Remember me</span>
              </label>

              <Link
                href="/account/forgot-password"
                className="text-[17px] font-semibold text-ink underline underline-offset-4 hover:text-forest transition-colors whitespace-nowrap"
              >
                Forgot password?
              </Link>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[68px] rounded-full bg-forest text-white text-[19px] font-semibold hover:bg-forest-light active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          {/* CREATE ACCOUNT */}
          <p className="text-center text-[17px] sm:text-[18px] text-ink/75 mt-8">
            Don&apos;t have an account?{" "}
            <Link
              href="/account/signup"
              className="font-semibold text-ink underline underline-offset-4 hover:text-forest transition-colors"
            >
              Create an account
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}