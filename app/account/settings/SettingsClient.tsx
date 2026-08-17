"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Check,
  ChevronRight,
  CreditCard,
  Heart,
  LogOut,
  MapPin,
  Mail,
  MessageSquare,
  PawPrint,
  Search,
  ShieldCheck,
  User,
  X,
  Camera,
} from "lucide-react";

import { supabase } from "@/lib/supabase/client";
import { cldThumb } from "@/lib/cloudinary";
import { BREEDS } from "../../data/breeds";

import {
  getCustomerProfile,
  updateCustomerProfile,
  getNotificationPrefs,
  updateNotificationPrefs,
  type CustomerProfile,
  type NotificationPrefs,
} from "@/lib/queries/customerProfile";

const TABS = [
  {
    id: "account",
    label: "Account",
    description: "Personal information",
    icon: User,
  },
  {
    id: "notifications",
    label: "Notifications",
    description: "Stay up to date",
    icon: Bell,
  },
  {
    id: "payments",
    label: "Payments",
    description: "Payment preferences",
    icon: CreditCard,
  },
  {
    id: "security",
    label: "Security",
    description: "Account access",
    icon: ShieldCheck,
  },
] as const;

type TabId = (typeof TABS)[number]["id"];

const notificationItems = [
  {
    key: "newsTips" as const,
    label: "News & Tips",
    description:
      "Occasional stories, puppy-care advice, and useful Haven Paws updates.",
    icon: Mail,
  },
  {
    key: "favoritesUpdates" as const,
    label: "Favorites Updates",
    description:
      "Get notified when puppies you&apos;ve saved have important status changes.",
    icon: Heart,
  },
  {
    key: "personalizedMatches" as const,
    label: "Personalized Matches",
    description:
      "Hear about puppies that match your breed and search preferences.",
    icon: PawPrint,
  },
  {
    key: "surveysFeedback" as const,
    label: "Surveys & Feedback",
    description:
      "Occasional opportunities to help us improve Haven Paws.",
    icon: MessageSquare,
  },
  {
    key: "ownerGuide" as const,
    label: "Puppy Owner Guide",
    description:
      "Helpful guidance and resources after your puppy arrives home.",
    icon: PawPrint,
  },
];

export default function SettingsClient() {
  const router = useRouter();

  /*
   * This ref points to the actual content area.
   * When a settings tab is clicked, we scroll this element into view.
   */
  const contentRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<TabId>("account");

  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [prefs, setPrefs] = useState<NotificationPrefs | null>(null);

  const [loading, setLoading] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const [breedInput, setBreedInput] = useState("");

  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadSettings() {
      setLoading(true);

      const [profileResult, prefsResult] = await Promise.all([
        getCustomerProfile(),
        getNotificationPrefs(),
      ]);

      if (!mounted) return;

      if (!profileResult) {
        router.push("/account/login");
        return;
      }

      setProfile(profileResult);
      setPrefs(prefsResult);
      setLoading(false);
    }

    loadSettings();

    return () => {
      mounted = false;
    };
  }, [router]);

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => {
      setToast(null);
    }, 3500);

    return () => window.clearTimeout(timer);
  }, [toast]);

  /*
   * IMPORTANT:
   * Handles tab selection AND automatically scrolls to the
   * content underneath the navigation.
   */
  function handleTabChange(tabId: TabId) {
    setActiveTab(tabId);

    /*
     * Wait for React to update the active section before scrolling.
     * requestAnimationFrame makes the scrolling feel much smoother
     * on mobile browsers.
     */
    window.requestAnimationFrame(() => {
      window.setTimeout(() => {
        const content = contentRef.current;

        if (!content) return;

        const isMobile = window.innerWidth < 1024;

        /*
         * On mobile/tablet we always scroll to the content.
         *
         * On desktop the content is already beside the sidebar,
         * so there is no need to move the page.
         */
        if (isMobile) {
          content.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 50);
    });
  }

  async function handleAvatarUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file || !profile) return;

    if (!file.type.startsWith("image/")) {
      showToast("error", "Please choose an image file.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast("error", "Please choose an image smaller than 5MB.");
      e.target.value = "";
      return;
    }

    setUploadingAvatar(true);

    const formData = new FormData();

    formData.append("file", file);

    const uploadPreset =
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!uploadPreset) {
      showToast("error", "Cloudinary upload configuration is missing.");
      setUploadingAvatar(false);
      e.target.value = "";
      return;
    }

    formData.append("upload_preset", uploadPreset);

    try {
      const cloudName =
        process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

      if (!cloudName) {
        throw new Error("Cloudinary configuration is missing.");
      }

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error("Upload failed.");
      }

      const data = await res.json();

      if (!data.secure_url) {
        throw new Error("No image URL was returned.");
      }

      const updatedProfile = {
        ...profile,
        avatarUrl: data.secure_url,
      };

      setProfile(updatedProfile);

      await updateCustomerProfile(updatedProfile);

      showToast(
        "success",
        "Your profile photo has been updated."
      );
    } catch {
      showToast(
        "error",
        "We couldn&apos;t update your profile photo. Please try again."
      );
    } finally {
      setUploadingAvatar(false);

      // Allows the same file to be selected again.
      e.target.value = "";
    }
  }

  async function saveProfile() {
    if (!profile) return;

    setSavingProfile(true);

    try {
      await updateCustomerProfile(profile);

      showToast(
        "success",
        "Your account details have been saved."
      );
    } catch {
      showToast(
        "error",
        "We couldn&apos;t save your account details."
      );
    } finally {
      setSavingProfile(false);
    }
  }

  async function savePrefs() {
    if (!prefs) return;

    setSavingPrefs(true);

    try {
      await updateNotificationPrefs(prefs);

      showToast(
        "success",
        "Your notification preferences have been saved."
      );
    } catch {
      showToast(
        "error",
        "We couldn&apos;t save your notification preferences."
      );
    } finally {
      setSavingPrefs(false);
    }
  }

  async function handleLogout() {
    if (signingOut) return;

    setSigningOut(true);

    try {
      await supabase.auth.signOut();

      router.push("/");
      router.refresh();
    } catch {
      showToast(
        "error",
        "We couldn&apos;t sign you out. Please try again."
      );

      setSigningOut(false);
    }
  }

  function showToast(
    type: "success" | "error",
    message: string
  ) {
    setToast({
      type,
      message,
    });
  }

  function addBreed(breed: string) {
    if (!prefs) return;

    if (prefs.breedUpdates.includes(breed)) {
      setBreedInput("");
      return;
    }

    setPrefs({
      ...prefs,
      breedUpdates: [
        ...prefs.breedUpdates,
        breed,
      ],
    });

    setBreedInput("");
  }

  function removeBreed(breed: string) {
    if (!prefs) return;

    setPrefs({
      ...prefs,
      breedUpdates: prefs.breedUpdates.filter(
        (item) => item !== breed
      ),
    });
  }

  const filteredBreedSuggestions = useMemo(() => {
    if (!breedInput.trim()) return [];

    const query = breedInput
      .trim()
      .toLowerCase();

    return BREEDS
      .filter(
        (breed) =>
          breed.toLowerCase().includes(query) &&
          !prefs?.breedUpdates.includes(breed)
      )
      .slice(0, 7);
  }, [breedInput, prefs]);

  const displayName =
    profile &&
    (profile.firstName?.trim() ||
      profile.lastName?.trim())
      ? `${profile.firstName ?? ""} ${
          profile.lastName ?? ""
        }`.trim()
      : "Your Haven Paws account";

  if (loading || !profile || !prefs) {
    return (
      <section className="min-h-[70vh] bg-cream">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-10 lg:py-16">
          <div className="animate-pulse">
            <div className="h-4 w-24 rounded bg-sage/10 mb-4" />

            <div className="h-10 w-64 rounded bg-sage/10 mb-3" />

            <div className="h-4 w-80 max-w-full rounded bg-sage/10 mb-10" />

            <div className="grid lg:grid-cols-[250px_1fr] gap-8">
              <div className="h-72 rounded-2xl bg-white border border-sage/10" />

              <div className="h-[500px] rounded-2xl bg-white border border-sage/10" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-cream">

      {/* ------------------------------------------------------------------ */}
      {/* TOAST                                                              */}
      {/* ------------------------------------------------------------------ */}

      {toast && (
        <div className="fixed top-5 right-5 z-[100] max-w-sm">
          <div
            className={`flex items-start gap-3 rounded-2xl border bg-white px-4 py-3.5 shadow-xl ${
              toast.type === "success"
                ? "border-forest/15"
                : "border-red-200"
            }`}
          >
            <div
              className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                toast.type === "success"
                  ? "bg-forest/10 text-forest"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {toast.type === "success" ? (
                <Check size={15} />
              ) : (
                <X size={15} />
              )}
            </div>

            <p className="text-sm text-ink leading-6">
              {toast.message}
            </p>

            <button
              type="button"
              onClick={() => setToast(null)}
              className="ml-2 text-sage hover:text-ink"
              aria-label="Dismiss notification"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* PAGE HEADER                                                        */}
      {/* ------------------------------------------------------------------ */}

      <div className="border-b border-sage/15 bg-cream">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-10 lg:py-14">

          <p className="eyebrow mb-3">
            Your Account
          </p>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">

            <div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-forest">
                Account settings
              </h1>

              <p className="mt-3 max-w-2xl text-sm sm:text-base text-ink/65 leading-7">
                Manage your personal information, puppy preferences,
                notifications, and account security in one place.
              </p>
            </div>

            <div className="hidden md:flex items-center gap-2 text-xs text-sage">
              <ShieldCheck size={15} />
              Your account is private
            </div>

          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* MAIN                                                               */}
      {/* ------------------------------------------------------------------ */}

      <div className="max-w-6xl mx-auto px-5 sm:px-6 py-8 lg:py-10">

        <div className="grid lg:grid-cols-[250px_minmax(0,1fr)] gap-8 xl:gap-10">

          {/* ---------------------------------------------------------------- */}
          {/* SIDEBAR                                                          */}
          {/* ---------------------------------------------------------------- */}

          <aside className="lg:sticky lg:top-24 lg:self-start">

            <div className="rounded-2xl border border-sage/15 bg-white overflow-hidden">

              {/* Mini profile */}
              <div className="p-5 border-b border-sage/10">

                <div className="flex items-center gap-3">

                  <div className="relative h-12 w-12 shrink-0 rounded-full overflow-hidden bg-cream-alt">

                    {profile.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={cldThumb(
                          profile.avatarUrl,
                          120
                        )}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <User
                          size={20}
                          className="text-sage"
                        />
                      </div>
                    )}

                  </div>

                  <div className="min-w-0">

                    <p className="font-medium text-sm text-forest truncate">
                      {displayName}
                    </p>

                    <p className="text-xs text-sage truncate mt-0.5">
                      {profile.email}
                    </p>

                  </div>

                </div>
              </div>

              {/* Navigation */}
              <nav
                className="p-2"
                aria-label="Account settings"
              >
                {TABS.map((item) => {
                  const Icon = item.icon;
                  const active =
                    activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        handleTabChange(item.id)
                      }
                      className={`w-full flex items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors ${
                        active
                          ? "bg-forest text-cream"
                          : "text-ink hover:bg-cream-alt"
                      }`}
                    >

                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                          active
                            ? "bg-white/10"
                            : "bg-cream-alt"
                        }`}
                      >
                        <Icon
                          size={17}
                          strokeWidth={1.7}
                        />
                      </span>

                      <span className="min-w-0 flex-1">

                        <span className="block text-sm font-medium">
                          {item.label}
                        </span>

                        <span
                          className={`block text-[11px] mt-0.5 ${
                            active
                              ? "text-cream/65"
                              : "text-sage"
                          }`}
                        >
                          {item.description}
                        </span>

                      </span>

                      {active && (
                        <ChevronRight
                          size={16}
                          className="shrink-0 opacity-70"
                        />
                      )}

                    </button>
                  );
                })}
              </nav>

              {/* Sign out */}
              <div className="border-t border-sage/10 p-3">

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={signingOut}
                  className="w-full flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sage hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                >

                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cream-alt">
                    <LogOut size={17} />
                  </span>

                  <span className="text-sm">
                    {signingOut
                      ? "Signing out..."
                      : "Sign out"}
                  </span>

                </button>

              </div>

            </div>
          </aside>

          {/* ---------------------------------------------------------------- */}
          {/* MOBILE NAV                                                       */}
          {/* ---------------------------------------------------------------- */}

          <div className="lg:hidden overflow-x-auto -mx-1 px-1 pb-1">

            <div className="flex gap-2 min-w-max">

              {TABS.map((item) => {
                const Icon = item.icon;

                const active =
                  activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      handleTabChange(item.id)
                    }
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm whitespace-nowrap ${
                      active
                        ? "bg-forest border-forest text-cream"
                        : "bg-white border-sage/20 text-ink"
                    }`}
                  >
                    <Icon size={15} />
                    {item.label}
                  </button>
                );
              })}

            </div>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* CONTENT                                                          */}
          {/* ---------------------------------------------------------------- */}

          <div
            ref={contentRef}
            className="min-w-0 scroll-mt-6"
          >

            {activeTab === "account" && (
              <AccountSection
                profile={profile}
                setProfile={setProfile}
                uploadingAvatar={uploadingAvatar}
                handleAvatarUpload={
                  handleAvatarUpload
                }
                savingProfile={savingProfile}
                saveProfile={saveProfile}
              />
            )}

            {activeTab === "notifications" && (
              <NotificationsSection
                prefs={prefs}
                setPrefs={setPrefs}
                breedInput={breedInput}
                setBreedInput={setBreedInput}
                filteredBreedSuggestions={
                  filteredBreedSuggestions
                }
                addBreed={addBreed}
                removeBreed={removeBreed}
                savingPrefs={savingPrefs}
                savePrefs={savePrefs}
              />
            )}

            {activeTab === "payments" && (
              <PaymentsSection />
            )}

            {activeTab === "security" && (
              <SecuritySection
                email={profile.email}
                onLogout={handleLogout}
                signingOut={signingOut}
              />
            )}

          </div>

        </div>
      </div>
    </section>
  );
}

/* ========================================================================== */
/* ACCOUNT                                                                    */
/* ========================================================================== */

function AccountSection({
  profile,
  setProfile,
  uploadingAvatar,
  handleAvatarUpload,
  savingProfile,
  saveProfile,
}: {
  profile: CustomerProfile;
  setProfile: React.Dispatch<
    React.SetStateAction<CustomerProfile | null>
  >;
  uploadingAvatar: boolean;
  handleAvatarUpload: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => Promise<void>;
  savingProfile: boolean;
  saveProfile: () => Promise<void>;
}) {
  return (
    <div className="space-y-6">

      <SectionHeading
        eyebrow="Profile"
        title="Account details"
        description="Keep your contact information up to date so we can reach you when it matters."
      />

      {/* Profile card */}
      <div className="rounded-2xl border border-sage/15 bg-white overflow-hidden">

        <div className="p-5 sm:p-7">

          <div className="flex flex-col sm:flex-row sm:items-center gap-5">

            <div className="relative shrink-0">

              <div className="h-24 w-24 rounded-full overflow-hidden bg-cream-alt border-4 border-cream">

                {profile.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cldThumb(
                      profile.avatarUrl,
                      200
                    )}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <User
                      size={34}
                      strokeWidth={1.4}
                      className="text-sage"
                    />
                  </div>
                )}

              </div>

              <label
                className={`absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-forest text-cream border-2 border-white cursor-pointer shadow-sm ${
                  uploadingAvatar
                    ? "opacity-60 cursor-wait"
                    : ""
                }`}
              >

                <Camera size={14} />

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  disabled={uploadingAvatar}
                  className="hidden"
                />

              </label>
            </div>

            <div>

              <p className="font-display text-xl text-forest">
                {profile.firstName ||
                profile.lastName
                  ? `${profile.firstName ?? ""} ${
                      profile.lastName ?? ""
                    }`.trim()
                  : "Your profile"}
              </p>

              <p className="text-sm text-sage mt-1">
                {uploadingAvatar
                  ? "Uploading your new photo..."
                  : "Add a profile photo so your account feels like yours."}
              </p>

              <label className="inline-flex items-center gap-1.5 mt-3 text-xs text-forest cursor-pointer hover:text-gold transition-colors">

                <Camera size={13} />

                Change profile photo

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  disabled={uploadingAvatar}
                  className="hidden"
                />

              </label>

            </div>

          </div>

        </div>
      </div>

      {/* Personal information */}
      <div className="rounded-2xl border border-sage/15 bg-white overflow-hidden">

        <div className="px-5 sm:px-7 py-5 border-b border-sage/10">

          <h2 className="font-display text-xl text-forest">
            Personal information
          </h2>

          <p className="text-sm text-sage mt-1">
            Information used for your Haven Paws account.
          </p>

        </div>

        <div className="p-5 sm:p-7">

          <div className="grid sm:grid-cols-2 gap-5">

            <Field
              label="First name"
              value={profile.firstName}
              onChange={(value) =>
                setProfile({
                  ...profile,
                  firstName: value,
                })
              }
              placeholder="First name"
            />

            <Field
              label="Last name"
              value={profile.lastName}
              onChange={(value) =>
                setProfile({
                  ...profile,
                  lastName: value,
                })
              }
              placeholder="Last name"
            />

          </div>

          <div className="mt-5">

            <label className="block text-xs font-medium uppercase tracking-wide text-sage mb-2">
              Email address
            </label>

            <div className="relative">

              <Mail
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sage"
              />

              <input
                value={profile.email}
                disabled
                className="w-full rounded-xl border border-sage/15 bg-cream-alt/60 pl-10 pr-4 py-3 text-sm text-ink/60 cursor-not-allowed"
              />

            </div>

            <p className="text-[11px] text-sage mt-2">
              Your login email is managed through your account authentication.
            </p>

          </div>

          <div className="grid sm:grid-cols-[1fr_160px] gap-5 mt-5">

            <Field
              label="Phone number"
              value={profile.phone}
              onChange={(value) =>
                setProfile({
                  ...profile,
                  phone: value,
                })
              }
              placeholder="Phone number"
            />

            <div>

              <label className="block text-xs font-medium uppercase tracking-wide text-sage mb-2">
                Phone type
              </label>

              <select
                value={profile.phoneType}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    phoneType: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-sage/20 bg-white px-4 py-3 text-sm text-ink focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/10"
              >
                <option>Mobile</option>
                <option>Home</option>
                <option>Work</option>
              </select>

            </div>

          </div>

        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 sm:px-7 py-4 bg-cream-alt/40 border-t border-sage/10">

          <p className="text-xs text-sage">
            Changes are saved to your Haven Paws profile.
          </p>

          <button
            type="button"
            onClick={saveProfile}
            disabled={savingProfile}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-forest text-cream px-6 py-3 text-sm hover:bg-forest-light transition-colors disabled:opacity-50"
          >
            {savingProfile ? (
              "Saving..."
            ) : (
              <>
                <Check size={15} />
                Save changes
              </>
            )}
          </button>

        </div>

      </div>
    </div>
  );
}

/* ========================================================================== */
/* NOTIFICATIONS                                                              */
/* ========================================================================== */

function NotificationsSection({
  prefs,
  setPrefs,
  breedInput,
  setBreedInput,
  filteredBreedSuggestions,
  addBreed,
  removeBreed,
  savingPrefs,
  savePrefs,
}: {
  prefs: NotificationPrefs;
  setPrefs: React.Dispatch<
    React.SetStateAction<NotificationPrefs | null>
  >;
  breedInput: string;
  setBreedInput: React.Dispatch<
    React.SetStateAction<string>
  >;
  filteredBreedSuggestions: readonly string[];
  addBreed: (breed: string) => void;
  removeBreed: (breed: string) => void;
  savingPrefs: boolean;
  savePrefs: () => Promise<void>;
}) {
  return (
    <div className="space-y-6">

      <SectionHeading
        eyebrow="Preferences"
        title="Notifications"
        description="Choose what you want to hear about and how Haven Paws should personalize your experience."
      />

      {/* Email notifications */}
      <div className="rounded-2xl border border-sage/15 bg-white overflow-hidden">

        <div className="px-5 sm:px-7 py-5 border-b border-sage/10">

          <div className="flex items-center gap-3">

            <IconBox>
              <Bell size={17} />
            </IconBox>

            <div>

              <h2 className="font-display text-xl text-forest">
                Email notifications
              </h2>

              <p className="text-sm text-sage mt-0.5">
                Helpful updates sent to your email.
              </p>

            </div>

          </div>

        </div>

        <div className="divide-y divide-sage/10">

          {notificationItems.map((item) => {
            const Icon = item.icon;

            return (
              <PreferenceToggle
                key={item.key}
                icon={Icon}
                label={item.label}
                description={item.description}
                checked={prefs[item.key]}
                onChange={(checked) =>
                  setPrefs({
                    ...prefs,
                    [item.key]: checked,
                  })
                }
              />
            );
          })}

        </div>

      </div>

      {/* SMS */}
      <div className="rounded-2xl border border-sage/15 bg-white overflow-hidden">

        <div className="px-5 sm:px-7 py-5 border-b border-sage/10">

          <div className="flex items-center gap-3">

            <IconBox>
              <MessageSquare size={17} />
            </IconBox>

            <div>

              <h2 className="font-display text-xl text-forest">
                Text messages
              </h2>

              <p className="text-sm text-sage mt-0.5">
                Get important puppy search updates by text.
              </p>

            </div>

          </div>

        </div>

        <PreferenceToggle
          icon={MessageSquare}
          label="Puppy Search Updates"
          description="Receive relevant updates when puppies matching your search become available."
          checked={prefs.puppySearchSms}
          onChange={(checked) =>
            setPrefs({
              ...prefs,
              puppySearchSms: checked,
            })
          }
        />

      </div>

      {/* Puppy preferences */}
      <div className="rounded-2xl border border-sage/15 bg-white overflow-hidden">

        <div className="px-5 sm:px-7 py-5 border-b border-sage/10">

          <div className="flex items-center gap-3">

            <IconBox>
              <PawPrint size={17} />
            </IconBox>

            <div>

              <h2 className="font-display text-xl text-forest">
                Puppy preferences
              </h2>

              <p className="text-sm text-sage mt-0.5">
                Tell us what you&apos;re looking for.
              </p>

            </div>

          </div>

        </div>

        <div className="p-5 sm:p-7">

          {/* Breeds */}
          <div>

            <label className="block text-xs font-medium uppercase tracking-wide text-sage mb-2">
              Breed updates
            </label>

            {prefs.breedUpdates.length > 0 ? (
              <div className="flex flex-wrap gap-2 mb-3">

                {prefs.breedUpdates.map((breed) => (
                  <span
                    key={breed}
                    className="inline-flex items-center gap-1.5 rounded-full bg-cream-alt border border-sage/10 px-3 py-1.5 text-xs text-forest"
                  >

                    <PawPrint size={11} />

                    {breed}

                    <button
                      type="button"
                      onClick={() =>
                        removeBreed(breed)
                      }
                      aria-label={`Remove ${breed}`}
                      className="ml-0.5 text-sage hover:text-red-500 transition-colors"
                    >
                      <X size={13} />
                    </button>

                  </span>
                ))}

              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-sage/20 bg-cream-alt/30 px-4 py-4 mb-3">

                <p className="text-sm text-sage">
                  No breed preferences selected yet.
                </p>

              </div>
            )}

            <div className="relative">

              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sage"
              />

              <input
                value={breedInput}
                onChange={(e) =>
                  setBreedInput(e.target.value)
                }
                placeholder="Search breeds to add..."
                className="w-full rounded-xl border border-sage/20 bg-white pl-10 pr-4 py-3 text-sm text-ink placeholder:text-sage/70 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/10"
              />

              {filteredBreedSuggestions.length > 0 && (
                <div className="absolute z-20 left-0 right-0 top-full mt-2 rounded-xl border border-sage/15 bg-white shadow-lg overflow-hidden">

                  {filteredBreedSuggestions.map(
                    (breed) => (
                      <button
                        key={breed}
                        type="button"
                        onClick={() =>
                          addBreed(breed)
                        }
                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-ink hover:bg-cream-alt transition-colors"
                      >

                        <PawPrint
                          size={14}
                          className="text-gold"
                        />

                        {breed}

                      </button>
                    )
                  )}

                </div>
              )}

            </div>

          </div>

          {/* Gender */}
          <div className="mt-7">

            <label className="block text-xs font-medium uppercase tracking-wide text-sage mb-2">
              Gender preference
            </label>

            <select
              value={prefs.genderUpdates}
              onChange={(e) =>
                setPrefs({
                  ...prefs,
                  genderUpdates: e.target.value,
                })
              }
              className="w-full rounded-xl border border-sage/20 bg-white px-4 py-3 text-sm text-ink focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/10"
            >
              <option value="any">
                Any gender
              </option>

              <option value="male">
                Male puppies
              </option>

              <option value="female">
                Female puppies
              </option>
            </select>

          </div>

          {/* Location */}
          <div className="mt-5">

            <label className="block text-xs font-medium uppercase tracking-wide text-sage mb-2">
              Preferred location
            </label>

            <div className="relative">

              <MapPin
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sage"
              />

              <input
                value={prefs.location}
                onChange={(e) =>
                  setPrefs({
                    ...prefs,
                    location: e.target.value,
                  })
                }
                placeholder="City, state, or ZIP code"
                className="w-full rounded-xl border border-sage/20 bg-white pl-10 pr-4 py-3 text-sm text-ink placeholder:text-sage/70 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/10"
              />

            </div>

            <p className="text-xs text-sage mt-2">
              Used to make nearby puppy alerts more relevant.
            </p>

          </div>

        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 sm:px-7 py-4 bg-cream-alt/40 border-t border-sage/10">

          <p className="text-xs text-sage leading-5">
            You can change these preferences anytime.
          </p>

          <button
            type="button"
            onClick={savePrefs}
            disabled={savingPrefs}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-forest text-cream px-6 py-3 text-sm hover:bg-forest-light transition-colors disabled:opacity-50"
          >

            {savingPrefs ? (
              "Saving..."
            ) : (
              <>
                <Check size={15} />
                Save preferences
              </>
            )}

          </button>

        </div>

      </div>
    </div>
  );
}

/* ========================================================================== */
/* PAYMENTS                                                                   */
/* ========================================================================== */

function PaymentsSection() {
  return (
    <div className="space-y-6">

      <SectionHeading
        eyebrow="Payments"
        title="Payment settings"
        description="Manage payment preferences for future Haven Paws purchases."
      />

      <div className="rounded-2xl border border-sage/15 bg-white overflow-hidden">

        <div className="p-5 sm:p-7">

          <div className="flex items-start gap-4">

            <IconBox large>
              <CreditCard size={21} />
            </IconBox>

            <div>

              <h2 className="font-display text-xl text-forest">
                Payment methods
              </h2>

              <p className="text-sm text-ink/65 leading-6 mt-1">
                No payment method is currently saved to your account.
              </p>

            </div>

          </div>

          <div className="mt-7 rounded-xl border border-gold/20 bg-gold/5 p-4">

            <div className="flex items-start gap-3">

              <ShieldCheck
                size={18}
                className="text-forest mt-0.5 shrink-0"
              />

              <div>

                <p className="text-sm font-medium text-forest">
                  Your safety comes first
                </p>

                <p className="text-xs text-ink/65 leading-5 mt-1">
                  Only complete payments through the official Haven Paws
                  platform. Never send money directly to a breeder outside
                  the approved payment process.
                </p>

              </div>

            </div>

          </div>

          <div className="mt-7">

            <button
              type="button"
              disabled
              className="inline-flex items-center justify-center gap-2 rounded-full border border-sage/20 px-6 py-3 text-sm text-sage cursor-not-allowed"
            >
              <CreditCard size={15} />
              Add payment method
            </button>

            <p className="text-xs text-sage mt-3">
              Payment method management will become available when payments
              are enabled for your account.
            </p>

          </div>

        </div>
      </div>

      <div className="rounded-2xl border border-sage/15 bg-white p-5 sm:p-7">

        <h2 className="font-display text-xl text-forest">
          Payment protection
        </h2>

        <p className="text-sm text-ink/65 leading-6 mt-2">
          Haven Paws is designed to keep the puppy-buying process organized,
          transparent, and secure. Review our terms before making any purchase.
        </p>

        <a
          href="/terms"
          className="inline-flex items-center gap-1 mt-5 text-sm text-forest hover:text-gold transition-colors"
        >
          Review terms
          <ChevronRight size={15} />
        </a>

      </div>
    </div>
  );
}

/* ========================================================================== */
/* SECURITY                                                                   */
/* ========================================================================== */

function SecuritySection({
  email,
  onLogout,
  signingOut,
}: {
  email: string;
  onLogout: () => Promise<void>;
  signingOut: boolean;
}) {
  return (
    <div className="space-y-6">

      <SectionHeading
        eyebrow="Account"
        title="Security"
        description="Manage access to your Haven Paws account."
      />

      <div className="rounded-2xl border border-sage/15 bg-white overflow-hidden">

        <div className="p-5 sm:p-7">

          <div className="flex items-start gap-4">

            <IconBox large>
              <ShieldCheck size={21} />
            </IconBox>

            <div className="min-w-0">

              <h2 className="font-display text-xl text-forest">
                Account access
              </h2>

              <p className="text-sm text-ink/65 leading-6 mt-1">
                Your Haven Paws account is authenticated using your email
                address.
              </p>

            </div>

          </div>

          <div className="mt-6 rounded-xl bg-cream-alt/60 border border-sage/10 px-4 py-4">

            <p className="text-xs uppercase tracking-wide text-sage">
              Login email
            </p>

            <p className="text-sm text-forest mt-1 break-all">
              {email}
            </p>

          </div>

        </div>
      </div>

      {/* Security information */}
      <div className="rounded-2xl border border-sage/15 bg-white overflow-hidden">

        <div className="px-5 sm:px-7 py-5 border-b border-sage/10">

          <h2 className="font-display text-xl text-forest">
            Account protection
          </h2>

        </div>

        <div className="p-5 sm:p-7 space-y-4">

          <SecurityRow
            title="Authenticated account"
            description="Your account is protected by Haven Paws authentication."
            status="Active"
          />

          <SecurityRow
            title="Private profile"
            description="Your personal account information isn&apos;t displayed publicly."
            status="Protected"
          />

        </div>
      </div>

      {/* Danger zone */}
      <div className="rounded-2xl border border-red-200 bg-white overflow-hidden">

        <div className="px-5 sm:px-7 py-5 border-b border-red-100">

          <p className="text-xs uppercase tracking-wide text-red-500">
            Account actions
          </p>

          <h2 className="font-display text-xl text-red-700 mt-1">
            Sign out
          </h2>

        </div>

        <div className="p-5 sm:p-7">

          <p className="text-sm text-ink/65 leading-6">
            Sign out of this Haven Paws account on this device.
          </p>

          <button
            type="button"
            onClick={onLogout}
            disabled={signingOut}
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-red-200 px-5 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            <LogOut size={15} />

            {signingOut
              ? "Signing out..."
              : "Sign out"}
          </button>

        </div>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* SHARED COMPONENTS                                                          */
/* ========================================================================== */

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-7">

      <p className="text-[11px] uppercase tracking-[0.18em] text-sage font-medium mb-2">
        {eyebrow}
      </p>

      <h2 className="font-display text-2xl sm:text-3xl text-forest">
        {title}
      </h2>

      <p className="text-sm text-ink/60 leading-6 mt-2 max-w-2xl">
        {description}
      </p>

    </div>
  );
}

function IconBox({
  children,
  large = false,
}: {
  children: React.ReactNode;
  large?: boolean;
}) {
  return (
    <div
      className={`shrink-0 flex items-center justify-center rounded-xl bg-cream-alt text-forest ${
        large ? "h-12 w-12" : "h-9 w-9"
      }`}
    >
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>

      <label className="block text-xs font-medium uppercase tracking-wide text-sage mb-2">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-xl border border-sage/20 bg-white px-4 py-3 text-sm text-ink placeholder:text-sage/60 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/10"
      />

    </div>
  );
}

function PreferenceToggle({
  icon: Icon,
  label,
  description,
  checked,
  onChange,
}: {
  icon: React.ComponentType<{
    size?: number;
    strokeWidth?: number;
  }>;
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-4 px-5 sm:px-7 py-5">

      <IconBox>
        <Icon
          size={17}
          strokeWidth={1.7}
        />
      </IconBox>

      <div className="min-w-0 flex-1 pr-3">

        <p className="text-sm font-medium text-ink">
          {label}
        </p>

        <p className="text-xs text-sage leading-5 mt-1 max-w-xl">
          {description}
        </p>

      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={`${
          checked ? "Disable" : "Enable"
        } ${label}`}
        onClick={() =>
          onChange(!checked)
        }
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
          checked
            ? "bg-forest"
            : "bg-sage/20"
        }`}
      >

        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
            checked
              ? "translate-x-6"
              : "translate-x-1"
          }`}
        />

      </button>
    </div>
  );
}

function SecurityRow({
  title,
  description,
  status,
}: {
  title: string;
  description: string;
  status: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-sage/10 bg-cream-alt/30 p-4">

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest/10 text-forest">
        <Check size={16} />
      </div>

      <div className="min-w-0 flex-1">

        <p className="text-sm font-medium text-ink">
          {title}
        </p>

        <p className="text-xs text-sage leading-5 mt-0.5">
          {description}
        </p>

      </div>

      <span className="hidden sm:block text-[11px] font-medium text-forest bg-forest/5 rounded-full px-3 py-1">
        {status}
      </span>

    </div>
  );
}