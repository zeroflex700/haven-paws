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
  Phone,
  Sparkles,
  User,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { getSafeRedirect } from "@/lib/auth/safe-redirect";
import GoogleAuthButton from "@/app/components/auth/GoogleAuthButton";

const RETURN_URL_KEY = "haven_paws_login_return_url";

const GLYPHS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*?";

export default function CustomerLoginPage() {
  const router = useRouter();

  const sceneRef = useRef<HTMLElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] =
    useState(false);
  const [rememberMe, setRememberMe] =
    useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [next, setNext] = useState("/account");

  const [displayText, setDisplayText] =
    useState("");

  const [cursorActive, setCursorActive] =
    useState(false);

  /*
   * Keep the existing redirect behaviour unchanged.
   */
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

  /*
   * Typewriter + glyph scrambling.
   */
  useEffect(() => {
    const target = "Welcome back.";

    let frame = 0;
    let interval: ReturnType<typeof setInterval>;

    interval = setInterval(() => {
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

  /*
   * Desktop spotlight.
   */
  useEffect(() => {
    const scene = sceneRef.current;

    if (!scene) return;

    const media = window.matchMedia(
      "(pointer: fine)"
    );

    if (!media.matches) return;

    function handleMove(event: PointerEvent) {
      const rect = scene.getBoundingClientRect();

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

    return () => {
      scene.removeEventListener(
        "pointermove",
        handleMove
      );
    };
  }, []);

  /*
   * Subtle 3D tilt.
   */
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

    const rect = element.getBoundingClientRect();

    const x =
      (event.clientX - rect.left) /
      rect.width;

    const y =
      (event.clientY - rect.top) /
      rect.height;

    const rotateY = (x - 0.5) * 5;
    const rotateX = (0.5 - y) * 5;

    element.style.setProperty(
      "--tilt-x",
      `${rotateX}deg`
    );

    element.style.setProperty(
      "--tilt-y",
      `${rotateY}deg`
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

    const burst = document.createElement("div");

    burst.className = "auth-particle-burst";

    for (let i = 0; i < 24; i += 1) {
      const particle =
        document.createElement("span");

      const angle =
        (Math.PI * 2 * i) / 24;

      const distance =
        70 + Math.random() * 90;

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

  async function handleLogin(
    e: React.FormEvent
  ) {
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
      setError(
        "Incorrect email or password."
      );
      return;
    }

    burstParticles();

    const destination =
      getSafeRedirect(next);

    sessionStorage.removeItem(
      RETURN_URL_KEY
    );

    window.setTimeout(() => {
      router.replace(destination);
      router.refresh();
    }, 500);
  }

  async function handleFacebookOAuth() {
    setError("");

    const destination =
      getSafeRedirect(next);

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
        provider: "facebook",
        options: {
          redirectTo:
            callbackUrl.toString(),
        },
      });

    if (error) {
      setError(
        "Unable to continue with this login method."
      );
    }
  }

  const signupHref =
    `/account/signup?next=${encodeURIComponent(
      next
    )}`;

  return (
    <main
      ref={sceneRef}
      className="auth-scene"
      data-cursor-active={
        cursorActive ? "true" : "false"
      }
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

      {/* HEADER */}
      <header className="auth-header">
        <Link
          href="/"
          aria-label="Haven Paws home"
          className="auth-brand"
          onMouseEnter={() =>
            setCursorActive(true)
          }
          onMouseLeave={() =>
            setCursorActive(false)
          }
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

        <div className="auth-header-actions">
          <a
            href="tel:"
            aria-label="Call Haven Paws"
            className="auth-icon-action"
          >
            <Phone
              size={17}
              strokeWidth={1.7}
            />
          </a>

          <Link
            href="/account/login"
            aria-label="Account"
            className="auth-icon-action"
          >
            <User
              size={17}
              strokeWidth={1.7}
            />
          </Link>
        </div>
      </header>

      <section className="auth-layout">
        {/* LEFT SIDE */}
        <div className="auth-intro">
          <div className="auth-intro-inner">
            <div className="auth-kicker">
              <span className="auth-kicker-dot" />
              <span>
                Your journey continues
              </span>
            </div>

            <h1
              className="auth-display"
              aria-label="Welcome back."
            >
              <span
                aria-hidden="true"
                className="auth-scramble"
              >
                {displayText}
              </span>
            </h1>

            <p className="auth-intro-copy">
              Pick up exactly where you left off.
              Your saved puppies, conversations,
              and journey are waiting for you.
            </p>

            <div className="auth-status-line">
              <Sparkles
                size={15}
                strokeWidth={1.7}
              />
              <span>
                Thoughtful connections begin here.
              </span>
            </div>
          </div>

          <div
            className="auth-floating-word"
            aria-hidden="true"
          >
            FIND
          </div>
        </div>

        {/* RIGHT SIDE */}
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
                  Account access
                </p>

                <h2>
                  Continue your
                  <span> story.</span>
                </h2>

                <p>
                  Sign in and return to where you
                  were exploring.
                </p>
              </div>

              <div className="auth-provider-stack">
                <GoogleAuthButton
                  label="Continue with Google"
                  nextPath={next}
                />

                <button
                  type="button"
                  onClick={
                    handleFacebookOAuth
                  }
                  className="auth-provider-button"
                >
                  <span className="auth-facebook-icon">
                    f
                  </span>

                  <span>
                    Continue with Facebook
                  </span>
                </button>
              </div>

              <div className="auth-divider">
                <span />
                <p>or use your email</p>
                <span />
              </div>

              <form
                onSubmit={handleLogin}
                className="auth-form"
              >
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
                      setEmail(
                        e.target.value
                      )
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
                    autoComplete="current-password"
                    placeholder=" "
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
                  />

                  <label htmlFor="password">
                    Password
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

                <div className="auth-options">
                  <label className="auth-check-label">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) =>
                        setRememberMe(
                          e.target.checked
                        )
                      }
                    />

                    <span className="auth-check">
                      <Check
                        size={13}
                        strokeWidth={2.5}
                      />
                    </span>

                    <span>
                      Remember me
                    </span>
                  </label>

                  <Link
                    href="/account/forgot-password"
                    className="auth-forgot"
                  >
                    Forgot password?
                  </Link>
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
                  onMouseEnter={() =>
                    setCursorActive(true)
                  }
                  onMouseLeave={() =>
                    setCursorActive(false)
                  }
                >
                  <span className="auth-submit-text">
                    {loading
                      ? "Opening your journey"
                      : "Log in"}
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
                New to Haven Paws?
                <Link href={signupHref}>
                  Create an account
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