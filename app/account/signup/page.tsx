"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PawPrint } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { getSafeRedirect } from "@/lib/auth/safe-redirect";
import GoogleAuthButton from "@/app/components/auth/GoogleAuthButton";
import AuthMotionProvider from "@/app/components/auth/AuthMotionProvider";
import AuthBackground from "@/app/components/auth/AuthBackground";
import AuthCard from "@/app/components/auth/AuthCard";
import AuthHeading from "@/app/components/auth/AuthHeading";
import AuthInput from "@/app/components/auth/AuthInput";

const RETURN_URL_KEY = "haven_paws_login_return_url";

export default function CustomerSignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [next, setNext] = useState("/account");

  // Same "next" resolution as the login page, so switching between
  // sign-in and sign-up never loses the original destination.
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

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }

    const destination = getSafeRedirect(next);
    sessionStorage.removeItem(RETURN_URL_KEY);

    router.push(destination);
    router.refresh();
  }

  const loginHref = `/account/login?next=${encodeURIComponent(next)}`;

  return (
    <AuthMotionProvider>
      <main className="min-h-[100dvh] bg-[#193b35] lg:grid lg:grid-cols-[1fr_minmax(0,480px)]">
        {/* VISUAL SIDE — desktop only, sits first so the form reads as "next step" */}
        <div className="relative hidden lg:block order-1">
          <AuthBackground variant="signup" />
          <div className="relative h-full flex flex-col justify-end p-16 xl:p-20">
            <p className="font-display text-white/90 text-[26px] xl:text-[30px] leading-snug max-w-md">
              This is the start of something worth wagging about.
            </p>
            <p className="text-white/55 text-[14px] mt-3 max-w-sm">
              Create an account to save favorites, message breeders, and track your journey to bringing a puppy home.
            </p>
          </div>
        </div>

        {/* FORM SIDE */}
        <div className="relative flex flex-col min-h-[100dvh] lg:min-h-0 order-2">
          <div
            className="lg:hidden absolute inset-0 -z-10"
            style={{ maxHeight: "38vh" }}
          >
            <AuthBackground variant="signup" />
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
              <AuthHeading eyebrow="Start your journey" text="Create your account" />
              <p className="text-white/60 text-[14px] mt-3 mb-8">
                It takes less than a minute.
              </p>

              <GoogleAuthButton label="Sign up with Google" nextPath={next} />

              <div className="flex items-center gap-4 my-7">
                <div className="flex-1 h-px bg-white/15" />
                <span className="text-[12px] text-white/45 whitespace-nowrap uppercase tracking-wider">
                  Or with email
                </span>
                <div className="flex-1 h-px bg-white/15" />
              </div>

              <form onSubmit={handleSignup} className="space-y-4">
                <AuthInput
                  id="name"
                  required
                  placeholder="Full name"
                  label="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <AuthInput
                  id="email"
                  type="email"
                  required
                  placeholder="Email"
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <AuthInput
                  id="password"
                  type="password"
                  required
                  placeholder="Password"
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

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
                  {loading ? "Creating account..." : "Create account"}
                </button>
              </form>

              <p className="text-center text-[14px] text-white/60 mt-7">
                Already have an account?{" "}
                <Link
                  href={loginHref}
                  className="text-[#d7a94b] font-medium underline-offset-4 hover:underline"
                >
                  Log in
                </Link>
              </p>
            </AuthCard>
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
