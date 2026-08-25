"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  PawPrint,
  Sparkles,
  UserRound,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { getSafeRedirect } from "@/lib/auth/safe-redirect";
import GoogleAuthButton from "@/app/components/auth/GoogleAuthButton";

const RETURN_URL_KEY =
  "haven_paws_login_return_url";

const GLYPHS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*?";

export default function CustomerSignupPage() {
  const router = useRouter();

  const sceneRef = useRef<HTMLElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [next, setNext] = useState("/account");

  const [displayText, setDisplayText] =
    useState("");

  useEffect(() => {
    const params = new URLSearchParams(
      window.location.search
    );

    const queryNext = params.get("next");

    if (queryNext) {
      const safe = getSafeRedirect(queryNext);

      setNext(safe);

      sessionStorage.setItem(
        RETURN_URL_KEY,
        safe
      );

      return;
    }

    const saved = sessionStorage.getItem(
      RETURN_URL_KEY
    );

    if (saved) {
      setNext(getSafeRedirect(saved));
    }
  }, []);
  
  useEffect(() => {
  if (
    !window.matchMedia("(pointer: fine)").matches
  ) {
    return;
  }

  function handleCursorMove(event: PointerEvent) {
    document.documentElement.style.setProperty(
      "--cursor-x",
      `${event.clientX}px`
    );

    document.documentElement.style.setProperty(
      "--cursor-y",
      `${event.clientY}px`
    );
  }

  window.addEventListener(
    "pointermove",
    handleCursorMove
  );

  return () => {
    window.removeEventListener(
      "pointermove",
      handleCursorMove
    );
  };
}, []);

  useEffect(() => {
    const target = "Begin here.";

    let frame = 0;

    const interval = setInterval(() => {
      const revealed = Math.min(
        target.length,
        Math.floor(frame / 3)
      );

      const text = target
        .split("")
        .map((character, index) => {
          if (index < revealed) {
            return character;
          }

          if (character === " ") {
            return " ";
          }

          return GLYPHS[
            Math.floor(
              Math.random() * GLYPHS.length
            )
          ];
        })
        .join("");

      setDisplayText(text);

      frame += 1;

      if (revealed >= target.length) {
        clearInterval(interval);
        setDisplayText(target);
      }
    }, 38);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const scene = sceneRef.current;

    if (!scene) return;

    if (
      !window.matchMedia("(pointer: fine)")
        .matches
    ) {
      return;
    }

    function handleMove(event: PointerEvent) {
      if (!scene) return;

      const rect =
        scene.getBoundingClientRect();

      const x =
        ((event.clientX - rect.left) /
          rect.width) *
        100;

      const y =
        ((event.clientY - rect.top) /
          rect.height) *
        100;

      scene.style.setProperty(
        "--spotlight-x",
        `${x}%`
      );

      scene.style.setProperty(
        "--spotlight-y",
        `${y}%`
      );
    }

    scene.addEventListener(
      "pointermove",
      handleMove
    );

    return () =>
      scene.removeEventListener(
        "pointermove",
        handleMove
      );
  }, []);

  function handleTilt(
    event: React.PointerEvent<HTMLDivElement>
  ) {
    if (
      !window.matchMedia("(pointer: fine)")
        .matches
    ) {
      return;
    }

    const element = tiltRef.current;

    if (!element) return;

    const rect =
      element.getBoundingClientRect();

    const x =
      (event.clientX - rect.left) /
      rect.width;

    const y =
      (event.clientY - rect.top) /
      rect.height;

    element.style.setProperty(
      "--tilt-x",
      `${(0.5 - y) * 5}deg`
    );

    element.style.setProperty(
      "--tilt-y",
      `${(x - 0.5) * 5}deg`
    );
  }

  function resetTilt() {
    const element = tiltRef.current;

    if (!element) return;

    element.style.setProperty(
      "--tilt-x",
      "0deg"
    );

    element.style.setProperty(
      "--tilt-y",
      "0deg"
    );
  }

  function burstParticles() {
    if (
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    ) {
      return;
    }

    const burst =
      document.createElement("div");

    burst.className = "auth-particle-burst";

    for (let i = 0; i < 28; i += 1) {
      const particle =
        document.createElement("span");

      const angle =
        (Math.PI * 2 * i) / 28;

      const distance =
        75 + Math.random() * 100;

      particle.style.setProperty(
        "--x",
        `${Math.cos(angle) * distance}px`
      );

      particle.style.setProperty(
        "--y",
        `${Math.sin(angle) * distance}px`
      );

      particle.style.setProperty(
        "--delay",
        `${Math.random() * 120}ms`
      );

      burst.appendChild(particle);
    }

    document.body.appendChild(burst);

    window.setTimeout(() => {
      burst.remove();
    }, 1300);
  }

  async function handleSignup(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const { error } =
      await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    burstParticles();

    const destination =
      getSafeRedirect(next);

    sessionStorage.removeItem(
      RETURN_URL_KEY
    );

    window.setTimeout(() => {
      router.push(destination);
      router.refresh();
    }, 500);
  }

  const loginHref =
    `/account/login?next=${encodeURIComponent(
      next
    )}`;

  return (
    <main
      ref={sceneRef}
      className="auth-scene auth-scene-signup"
    >
      <div
        className="auth-noise"
        aria-hidden="true"
      />

      <div
        className="auth-orb auth-orb-one"
        aria-hidden="true"
      />

      <div
        className="auth-orb auth-orb-two"
        aria-hidden="true"
      />

      <div
        className="auth-orb auth-orb-three"
        aria-hidden="true"
      />

      <div
        className="auth-grid"
        aria-hidden="true"
      />

      <header className="auth-header">
        <Link
          href="/"
          aria-label="Haven Paws home"
          className="auth-brand"
        >
          <span className="auth-brand-mark">
            <PawPrint
              size={18}
              strokeWidth={1.7}
            />
          </span>

          <span className="auth-brand-name">
            Haven Paws
          </span>
        </Link>

        <div className="auth-header-note">
          Already a member?
          <Link href={loginHref}>
            Log in
          </Link>
        </div>
      </header>

      <section className="auth-layout">
        <div className="auth-intro">
          <div className="auth-intro-inner">
            <div className="auth-kicker">
              <span className="auth-kicker-dot" />
              <span>
                A new chapter starts here
              </span>
            </div>

            <h1
              className="auth-display"
              aria-label="Begin here."
            >
              <span
                aria-hidden="true"
                className="auth-scramble"
              >
                {displayText}
              </span>
            </h1>

            <p className="auth-intro-copy">
              Create your Haven Paws account and
              start discovering the companion who
              belongs in your story.
            </p>

            <div className="auth-status-line">
              <Sparkles
                size={15}
                strokeWidth={1.7}
              />

              <span>
                Every great journey starts with a
                hello.
              </span>
            </div>
          </div>

          <div
            className="auth-floating-word"
            aria-hidden="true"
          >
            BELONG
          </div>
        </div>

        <div className="auth-form-zone">
          <div
            ref={tiltRef}
            className="auth-form-shell"
            onPointerMove={handleTilt}
            onPointerLeave={resetTilt}
          >
            <div className="auth-form-glass-layer" />

            <div className="auth-form-content">
              <div className="auth-form-heading">
                <p className="auth-eyebrow">
                  Create your account
                </p>

                <h2>
                  Make it
                  <span> yours.</span>
                </h2>

                <p>
                  A few details and your Haven Paws
                  journey can begin.
                </p>
              </div>

              <div className="auth-provider-stack">
                <GoogleAuthButton
                  label="Sign up with Google"
                  nextPath={next}
                />
              </div>

              <div className="auth-divider">
                <span />
                <p>or sign up with email</p>
                <span />
              </div>

              <form
                onSubmit={handleSignup}
                className="auth-form"
              >
                <div className="auth-field">
                  <UserRound
                    size={18}
                    strokeWidth={1.7}
                    aria-hidden="true"
                  />

                  <input
                    id="name"
                    required
                    autoComplete="name"
                    placeholder=" "
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                  />

                  <label htmlFor="name">
                    Full name
                  </label>

                  <span className="auth-field-light" />
                </div>

                <div className="auth-field">
                  <Mail
                    size={18}
                    strokeWidth={1.7}
                    aria-hidden="true"
                  />

                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder=" "
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                  />

                  <label htmlFor="email">
                    Email address
                  </label>

                  <span className="auth-field-light" />
                </div>

                <div className="auth-field">
                  <LockKeyhole
                    size={18}
                    strokeWidth={1.7}
                    aria-hidden="true"
                  />

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    required
                    autoComplete="new-password"
                    placeholder=" "
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
                  />

                  <label htmlFor="password">
                    Create a password
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (current) =>
                          !current
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="auth-password-toggle"
                  >
                    {showPassword ? (
                      <EyeOff
                        size={18}
                        strokeWidth={1.7}
                      />
                    ) : (
                      <Eye
                        size={18}
                        strokeWidth={1.7}
                      />
                    )}
                  </button>

                  <span className="auth-field-light" />
                </div>

                {error && (
                  <p
                    role="alert"
                    className="auth-error"
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`auth-submit ${
                    loading
                      ? "is-loading"
                      : ""
                  }`}
                >
                  <span className="auth-submit-text">
                    {loading
                      ? "Creating your account"
                      : "Create account"}
                  </span>

                  <span className="auth-submit-icon">
                    {loading ? (
                      <span className="auth-spinner" />
                    ) : (
                      <ArrowRight
                        size={19}
                        strokeWidth={1.8}
                      />
                    )}
                  </span>
                </button>
              </form>

              <p className="auth-switch-copy">
                Already have an account?
                <Link href={loginHref}>
                  Log in
                  <ArrowRight
                    size={14}
                    strokeWidth={1.8}
                  />
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <div
        className="auth-cursor"
        aria-hidden="true"
      />
    </main>
  );
}