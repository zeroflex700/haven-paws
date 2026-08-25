"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PawPrint, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { getSafeRedirect } from "@/lib/auth/safe-redirect";
import GoogleAuthButton from "@/app/components/auth/GoogleAuthButton";
import AuthMotionProvider from "@/app/components/auth/AuthMotionProvider";
import AuthBackground from "@/app/components/auth/AuthBackground";
import AuthCard from "@/app/components/auth/AuthCard";
import AuthHeading from "@/app/components/auth/AuthHeading";
import AuthInput from "@/app/components/auth/AuthInput";
import AuthSocialButton from "@/app/components/auth/AuthSocialButton";

const RETURN_URL_KEY = "haven_paws_login_return_url";

function FacebookIcon() {
  return (
    <span className="w-5 h-5 rounded-full bg-[#1877F2] text-white flex items-center justify-center">
      <span className="text-[13px] font-bold leading-none">f</span>
    </span>
  );
}

export default function CustomerLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [next, setNext] = useState("/account");

  /*
   * Determine where the customer should go after login.
   *
   * Priority:
   * 1. "next" query parameter (full pathname + search string)
   * 2. previously saved page in sessionStorage (survives
   *    navigation between /account/login and /account/signup)
   * 3. /account
   *
   * We read window.location directly (not useSearchParams) so
   * this page never needs a Suspense boundary.
   */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryNext = params.get("next");

    if (queryNext) {
      const safe = getSafeRedirect(queryNext);
      setNext(safe);
      sessionStorage.setItem(RETURN_URL_KEY, safe);
      return;
    }

    const saved = sessionStorage.getItem(RETURN_URL_KEY);
    if (saved) {
      setNext(getSafeRedirect(saved));
    }
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      setError("Incorrect email or password.");
      return;
    }

    const destination = getSafeRedirect(next);
    sessionStorage.removeItem(RETURN_URL_KEY);

    setLoading(false);
    router.replace(destination);
    router.refresh();
  }

  async function handleFacebookOAuth() {
    setError("");

    const destination = getSafeRedirect(next);
    sessionStorage.setItem(RETURN_URL_KEY, destination);

    const callbackUrl = new URL("/auth/callback", window.location.origin);
    callbackUrl.searchParams.set("next", destination);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "facebook",
      options: { redirectTo: callbackUrl.toString() },
    });

    if (error) {
      setError("Unable to continue with this login method.");
    }
  }

  const signupHref = `/account/signup?next=${encodeURIComponent(next)}`;

  return (
    <AuthMotionProvider>
      <main className="min-h-[100dvh] bg-[#193b35] lg:grid lg:grid-cols-[minmax(0,480px)_1fr]">
        {/* FORM SIDE */}
        <div className="relative flex flex-col min-h-[100dvh] lg:min-h-0">
          <div
            className="lg:hidden absolute inset-0 -z-10"
            style={{ maxHeight: "38vh" }}
          >
            <AuthBackground variant="login" />
          </div>

          <div className="pt-[calc(env(safe-area-inset-top,0px)+20px)] px-6 sm:px-10 lg:px-12">
            <Link
              href="/"
              aria-label="Haven Paws home"
              className="auth-logo-link inline-flex items-center gap-2.5"
            >
              <span className="w-9 h-9 rounded-full bg-[#d7a94b]/90 flex items-center justify-center">
                <PawPrint size={17} className="text-[#193b35]" strokeWidth={1.7} />
              </span>
              <span className="font-display text-lg text-white tracking-tight">
                Haven Paws
              </span>
            </Link>
          </div>

          <div className="flex-1 flex items-center justify-center px-6 sm:px-10 lg:px-12 py-10">
            <AuthCard>
              <AuthHeading eyebrow="Welcome back" text="Log in to Haven Paws" />
              <p className="text-white/60 text-[14px] mt-3 mb-8">
                Pick up right where you left off.
              </p>

              <div className="space-y-3">
                <GoogleAuthButton label="Continue with Google" nextPath={next} />
                <AuthSocialButton
                  icon={<FacebookIcon />}
                  label="Continue with Facebook"
                  onClick={handleFacebookOAuth}
                />
              </div>

              <div className="flex items-center gap-4 my-7">
                <div className="flex-1 h-px bg-white/15" />
                <span className="text-[12px] text-white/45 whitespace-nowrap uppercase tracking-wider">
                  Or with email
                </span>
                <div className="flex-1 h-px bg-white/15" />
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <AuthInput
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="Email"
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <AuthInput
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="Password"
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  endAdornment={
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="text-white/60 hover:text-[#d7a94b] transition-colors p-1"
                    >
                      {showPassword ? (
                        <EyeOff size={20} strokeWidth={1.7} />
                      ) : (
                        <Eye size={20} strokeWidth={1.7} />
                      )}
                    </button>
                  }
                />

                <div className="flex items-center justify-between gap-4 pt-1 text-sm">
                  <label className="flex items-center gap-2.5 text-white/75 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="sr-only peer"
                    />
                    <span className="w-5 h-5 rounded-md border border-white/25 bg-white/5 flex items-center justify-center peer-checked:bg-[#d7a94b] peer-checked:border-[#d7a94b] transition-colors">
                      {rememberMe && (
                        <svg viewBox="0 0 20 20" fill="none" className="w-3.5 h-3.5 text-[#193b35]">
                          <path
                            d="M4 10.5L8 14L16 6"
                            stroke="currentColor"
                            strokeWidth="2.4"
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
                    className="text-[#d7a94b] font-medium underline-offset-4 hover:underline whitespace-nowrap"
                  >
                    Forgot password?
                  </Link>
                </div>

                {error && (
                  <p role="alert" className="text-sm text-red-300">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="auth-submit-btn relative w-full h-14 rounded-full bg-[#d7a94b] text-[#193b35] text-[15px] font-semibold overflow-hidden transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
                >
                  {loading ? "Logging in..." : "Log in"}
                </button>
              </form>

              <p className="text-center text-[14px] text-white/60 mt-7">
                Don&apos;t have an account?{" "}
                <Link
                  href={signupHref}
                  className="text-[#d7a94b] font-medium underline-offset-4 hover:underline"
                >
                  Create an account
                </Link>
              </p>
            </AuthCard>
          </div>
        </div>

        {/* VISUAL SIDE — desktop only */}
        <div className="relative hidden lg:block">
          <AuthBackground variant="login" />
          <div className="relative h-full flex flex-col justify-end p-16 xl:p-20">
            <p className="font-display text-white/90 text-[26px] xl:text-[30px] leading-snug max-w-md">
              Every good match starts with a warm welcome.
            </p>
            <p className="text-white/55 text-[14px] mt-3 max-w-sm">
              Your saved breeds, favorites, and conversations are exactly where you left them.
            </p>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .auth-logo-link {
          transition: transform 0.25s ease;
        }
        .auth-logo-link:hover {
          transform: translateY(-1px);
        }
        .auth-submit-btn::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            100deg,
            transparent 30%,
            rgba(255, 255, 255, 0.35) 50%,
            transparent 70%
          );
          transform: translateX(-120%);
        }
        .auth-submit-btn:hover::after {
          transform: translateX(120%);
          transition: transform 0.7s ease;
        }
        @media (prefers-reduced-motion: reduce) {
          .auth-logo-link,
          .auth-submit-btn {
            transition: none;
          }
          .auth-submit-btn::after {
            display: none;
          }
        }
      `}</style>
    </AuthMotionProvider>
  );
}
