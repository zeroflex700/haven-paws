"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  Heart,
  History,
  LogOut,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useFavorites } from "@/lib/hooks/useFavorites";
import { useRecentlyViewed } from "@/lib/hooks/useRecentlyViewed";
import { useSearchHistory } from "@/lib/hooks/useSearchHistory";

export default function AccountClient() {
  const router = useRouter();

  const [email, setEmail] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  const {
    favoriteIds,
    loading: favoritesLoading,
    isLoggedIn,
  } = useFavorites();

  const {
    items: recentlyViewed,
  } = useRecentlyViewed();

  const {
    terms,
  } = useSearchHistory();

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      const { data } = await supabase.auth.getUser();

      if (!mounted) return;

      if (!data.user) {
        router.push("/account/login");
        return;
      }

      const user = data.user;

      setEmail(user.email ?? null);

      const metadata = user.user_metadata ?? {};

      const name =
        metadata.full_name ??
        metadata.name ??
        metadata.display_name ??
        null;

      setDisplayName(
        typeof name === "string" && name.trim()
          ? name.trim()
          : null
      );

      setLoading(false);
    }

    loadUser();

    return () => {
      mounted = false;
    };
  }, [router]);

  async function handleSignOut() {
    if (signingOut) return;

    setSigningOut(true);

    await supabase.auth.signOut();

    router.push("/");
    router.refresh();
  }

  const firstName = useMemo(() => {
    if (displayName) {
      return displayName.split(" ")[0];
    }

    if (email) {
      return email.split("@")[0];
    }

    return "there";
  }, [displayName, email]);

  if (loading) {
    return (
      <section className="min-h-[70vh] bg-cream">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-12 lg:py-20">
          <div className="animate-pulse">
            <div className="h-4 w-28 rounded-full bg-sage/10 mb-5" />
            <div className="h-12 w-64 rounded-xl bg-sage/10 mb-4" />
            <div className="h-4 w-80 max-w-full rounded-full bg-sage/10 mb-12" />

            <div className="grid lg:grid-cols-[1.35fr_0.65fr] gap-6">
              <div className="h-64 rounded-[28px] bg-white border border-sage/10" />
              <div className="h-64 rounded-[28px] bg-white border border-sage/10" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <section className="min-h-[70vh] bg-cream">
      {/* ================================================================ */}
      {/* HERO / ACCOUNT HEADER                                            */}
      {/* ================================================================ */}

      <div className="relative overflow-hidden border-b border-sage/10 bg-forest text-white">
        <div className="absolute -right-24 -top-32 h-80 w-80 rounded-full border border-white/10" />
        <div className="absolute right-20 top-20 h-40 w-40 rounded-full border border-white/5" />
        <div className="absolute -left-20 bottom-[-100px] h-64 w-64 rounded-full bg-gold/10 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-12 sm:py-16 lg:py-20">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 backdrop-blur-sm mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/80 font-medium">
                  Your Haven Paws account
                </span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-[-0.025em] leading-[0.98]">
                Welcome back, {firstName}.
              </h1>

              <p className="mt-5 max-w-xl text-sm sm:text-base leading-7 text-white/65">
                Your puppy journey, thoughtfully organized in one place.
                Pick up where you left off, revisit puppies you loved, or
                continue exploring.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10">
                <UserRound size={18} strokeWidth={1.6} />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.16em] text-white/45">
                  Signed in as
                </p>
                <p className="mt-1 max-w-[260px] truncate text-sm text-white/85">
                  {email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/* DASHBOARD                                                        */}
      {/* ================================================================ */}

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-10 sm:py-12 lg:py-16">
        {/* Quick stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <DashboardStat
            icon={<Heart size={17} strokeWidth={1.7} />}
            label="Saved puppies"
            value={favoritesLoading ? "—" : favoriteIds.length}
          />

          <DashboardStat
            icon={<History size={17} strokeWidth={1.7} />}
            label="Recently viewed"
            value={recentlyViewed.length}
          />

          <DashboardStat
            icon={<Search size={17} strokeWidth={1.7} />}
            label="Searches"
            value={terms.length}
          />

          <DashboardStat
            icon={<ShieldCheck size={17} strokeWidth={1.7} />}
            label="Account status"
            value="Active"
          />
        </div>

        {/* Main action grid */}
        <div className="grid lg:grid-cols-[1.35fr_0.65fr] gap-6">
          {/* Continue exploring */}
          <div className="relative overflow-hidden rounded-[28px] bg-white border border-sage/10 shadow-[0_16px_50px_rgba(39,63,48,0.06)]">
            <div className="absolute right-0 top-0 h-48 w-48 translate-x-1/3 -translate-y-1/3 rounded-full bg-gold/10 blur-2xl" />

            <div className="relative p-6 sm:p-8 lg:p-10">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cream-alt text-forest mb-5">
                    <Sparkles size={20} strokeWidth={1.6} />
                  </div>

                  <p className="text-[10px] uppercase tracking-[0.18em] text-sage font-medium mb-2">
                    Continue your journey
                  </p>

                  <h2 className="font-display text-2xl sm:text-3xl text-forest tracking-tight">
                    Find the puppy that feels right.
                  </h2>

                  <p className="mt-3 max-w-xl text-sm leading-6 text-ink/60">
                    Explore available puppies from trusted breeders and
                    continue building your shortlist at your own pace.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/puppies"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-forest px-6 py-3.5 text-sm font-medium text-white transition-all hover:bg-forest-light active:scale-[0.98]"
                >
                  Browse All Puppies
                  <ArrowRight size={15} />
                </Link>

                {favoriteIds.length > 0 && (
                  <Link
                    href="/favorites"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-sage/20 bg-white px-6 py-3.5 text-sm font-medium text-forest transition-all hover:border-gold hover:bg-cream-alt active:scale-[0.98]"
                  >
                    View saved puppies
                    <Heart size={15} />
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Account card */}
          <div className="rounded-[28px] bg-cream-alt/55 border border-sage/10 p-6 sm:p-8">
            <p className="text-[10px] uppercase tracking-[0.18em] text-sage font-medium mb-3">
              Account
            </p>

            <h2 className="font-display text-2xl text-forest">
              Your account
            </h2>

            <p className="mt-3 text-sm leading-6 text-ink/60">
              You&apos;re signed in and ready to continue your Haven Paws
              journey.
            </p>

            <div className="mt-7 rounded-2xl border border-sage/10 bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cream-alt text-forest">
                  <ShieldCheck size={18} strokeWidth={1.6} />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-medium text-forest">
                    Account active
                  </p>
                  <p className="text-xs text-ink/50 mt-0.5 truncate">
                    {email}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              disabled={signingOut}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-sage/20 bg-white px-5 py-3 text-sm font-medium text-forest transition-all hover:border-red-300 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <LogOut size={15} />

              {signingOut ? "Signing out…" : "Sign Out"}
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* ACTIVITY                                                      */}
        {/* ============================================================ */}

        <div className="mt-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-sage font-medium mb-2">
                Your activity
              </p>

              <h2 className="font-display text-2xl sm:text-3xl text-forest tracking-tight">
                Pick up where you left off.
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Favorites */}
            <ActivityCard
              icon={<Heart size={18} strokeWidth={1.6} />}
              title="Saved puppies"
              description={
                favoriteIds.length > 0
                  ? `You have ${favoriteIds.length} puppy${
                      favoriteIds.length === 1 ? "" : "ies"
                    } saved.`
                  : "Save puppies you love so they are easy to find again."
              }
              count={
                favoritesLoading
                  ? undefined
                  : favoriteIds.length
              }
              href="/favorites"
              cta={
                favoriteIds.length > 0
                  ? "View favorites"
                  : "Start saving"
              }
            />

            {/* Recently viewed */}
            <ActivityCard
              icon={<History size={18} strokeWidth={1.6} />}
              title="Recently viewed"
              description={
                recentlyViewed.length > 0
                  ? "Revisit puppies and breeds you recently explored."
                  : "Puppies you visit will appear here for easy return."
              }
              count={recentlyViewed.length}
              href="/puppies"
              cta={
                recentlyViewed.length > 0
                  ? "Continue browsing"
                  : "Explore puppies"
              }
            />

            {/* Search */}
            <ActivityCard
              icon={<Search size={18} strokeWidth={1.6} />}
              title="Your searches"
              description={
                terms.length > 0
                  ? "Your recent search terms are ready to use again."
                  : "Search history will make returning to a search quicker."
              }
              count={terms.length}
              href="/puppies"
              cta="Search puppies"
            />
          </div>
        </div>

        {/* ============================================================ */}
        {/* TRUST / REASSURANCE                                           */}
        {/* ============================================================ */}

        <div className="mt-10 overflow-hidden rounded-[28px] border border-sage/10 bg-forest text-white">
          <div className="grid lg:grid-cols-[1.4fr_1fr]">
            <div className="relative p-7 sm:p-9 lg:p-10">
              <div className="absolute right-[-40px] top-[-80px] h-56 w-56 rounded-full border border-white/10" />

              <div className="relative">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/45 font-medium mb-3">
                  The Haven Paws approach
                </p>

                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl tracking-tight max-w-xl">
                  Your puppy journey should feel simple.
                </h2>

                <p className="mt-4 max-w-xl text-sm sm:text-base leading-7 text-white/60">
                  From discovering a puppy to taking those first steps
                  toward bringing them home, Haven Paws is designed to keep
                  the experience organized, thoughtful, and transparent.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 lg:grid-cols-1 border-t lg:border-t-0 lg:border-l border-white/10">
              <TrustPoint
                title="Trusted breeders"
                text="Discover puppies through a more thoughtful placement experience."
              />

              <TrustPoint
                title="Everything in one place"
                text="Keep the puppies and searches that matter to you easy to revisit."
              />

              <TrustPoint
                title="Support along the way"
                text="A clearer path from your first search to bringing your puppy home."
              />
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* FINAL CTA                                                     */}
        {/* ============================================================ */}

        <div className="mt-10 rounded-[28px] border border-sage/10 bg-white p-7 sm:p-9 text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-cream-alt text-forest">
            <Heart size={18} strokeWidth={1.6} />
          </div>

          <h2 className="font-display text-2xl sm:text-3xl text-forest mt-4">
            Your next chapter could start with a puppy.
          </h2>

          <p className="max-w-lg mx-auto mt-3 text-sm leading-6 text-ink/60">
            Take another look at the puppies currently waiting for their
            forever homes.
          </p>

          <Link
            href="/puppies"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-forest transition-all hover:bg-gold-light active:scale-[0.98]"
          >
            Explore Puppies
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ========================================================================== */
/* SMALL PRESENTATIONAL COMPONENTS                                            */
/* ========================================================================== */

function DashboardStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-sage/10 bg-white p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cream-alt text-forest">
          {icon}
        </div>

        <span className="text-2xl font-display text-forest">
          {value}
        </span>
      </div>

      <p className="mt-4 text-[10px] uppercase tracking-[0.14em] text-sage font-medium">
        {label}
      </p>
    </div>
  );
}

function ActivityCard({
  icon,
  title,
  description,
  count,
  href,
  cta,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  count?: number;
  href: string;
  cta: string;
}) {
  return (
    <div className="group rounded-[24px] border border-sage/10 bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(39,63,48,0.07)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cream-alt text-forest">
          {icon}
        </div>

        {typeof count === "number" && (
          <span className="rounded-full bg-cream-alt px-2.5 py-1 text-[10px] font-medium text-forest">
            {count}
          </span>
        )}
      </div>

      <h3 className="mt-6 font-display text-xl text-forest">
        {title}
      </h3>

      <p className="mt-2 min-h-[48px] text-sm leading-6 text-ink/55">
        {description}
      </p>

      <Link
        href={href}
        className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-forest transition-colors hover:text-sage"
      >
        {cta}
        <ChevronRight
          size={14}
          className="transition-transform group-hover:translate-x-0.5"
        />
      </Link>
    </div>
  );
}

function TrustPoint({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="p-6 lg:p-7 border-b sm:border-b-0 lg:border-b border-white/10 last:border-0">
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-gold" />

        <p className="text-sm font-medium text-white/90">
          {title}
        </p>
      </div>

      <p className="mt-2 text-xs leading-5 text-white/50">
        {text}
      </p>
    </div>
  );
}