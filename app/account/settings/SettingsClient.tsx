"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
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

const TABS = ["Account Details", "Payment Settings", "Notifications"] as const;

export default function SettingsClient() {
  const router = useRouter();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Account Details");
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [prefs, setPrefs] = useState<NotificationPrefs | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [breedInput, setBreedInput] = useState("");

  useEffect(() => {
    getCustomerProfile().then((p) => {
      if (!p) {
        router.push("/account/login");
        return;
      }
      setProfile(p);
    });
    getNotificationPrefs().then(setPrefs);
  }, [router]);

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    setUploadingAvatar(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      setProfile({ ...profile, avatarUrl: data.secure_url });
    } catch {
      alert("Upload failed");
    }
    setUploadingAvatar(false);
  }

  async function saveProfile() {
    if (!profile) return;
    setSavingProfile(true);
    try {
      await updateCustomerProfile(profile);
    } catch {
      alert("Save failed");
    }
    setSavingProfile(false);
  }

  async function savePrefs() {
    if (!prefs) return;
    setSavingPrefs(true);
    try {
      await updateNotificationPrefs(prefs);
    } catch {
      alert("Save failed");
    }
    setSavingPrefs(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  function addBreed(breed: string) {
    if (!prefs || prefs.breedUpdates.includes(breed)) return;
    setPrefs({ ...prefs, breedUpdates: [...prefs.breedUpdates, breed] });
    setBreedInput("");
  }

  function removeBreed(breed: string) {
    if (!prefs) return;
    setPrefs({ ...prefs, breedUpdates: prefs.breedUpdates.filter((b) => b !== breed) });
  }

  if (!profile || !prefs) {
    return <p className="text-sage px-6 py-10">Loading...</p>;
  }

  const inputClass =
    "w-full border border-sage/30 rounded-md px-3 py-2 focus:outline-none focus:border-gold";

  const filteredBreedSuggestions = breedInput
    ? BREEDS.filter((b) => b.toLowerCase().includes(breedInput.toLowerCase())).slice(0, 5)
    : [];

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="flex items-center gap-4 mb-8">
        <div className="relative">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-cream-alt">
            {profile.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={cldThumb(profile.avatarUrl, 150)} alt="" className="w-full h-full object-cover" />
            ) : null}
          </div>
          <label className="absolute -bottom-1 -right-1 bg-forest text-cream text-[10px] px-2 py-0.5 rounded-full cursor-pointer">
            {uploadingAvatar ? "..." : "+ Upload"}
            <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
          </label>
        </div>
        <div>
          <p className="text-forest font-medium">
            {profile.firstName || profile.lastName ? `${profile.firstName} ${profile.lastName}` : "Your Account"}
          </p>
          <p className="text-sm text-sage">{profile.email}</p>
        </div>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
              tab === t ? "bg-forest text-cream" : "bg-cream-alt text-ink"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Account Details" && (
        <div>
          <label className="block text-sm text-ink/80 mb-1">First Name</label>
          <input
            value={profile.firstName}
            onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
            className={`${inputClass} mb-3`}
          />
          <label className="block text-sm text-ink/80 mb-1">Last Name</label>
          <input
            value={profile.lastName}
            onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
            className={`${inputClass} mb-3`}
          />
          <label className="block text-sm text-ink/80 mb-1">Email Address</label>
          <input value={profile.email} disabled className={`${inputClass} mb-3 opacity-60`} />
          <label className="block text-sm text-ink/80 mb-1">Phone Number</label>
          <input
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            className={`${inputClass} mb-3`}
          />
          <label className="block text-sm text-ink/80 mb-1">Phone Number Type</label>
          <select
            value={profile.phoneType}
            onChange={(e) => setProfile({ ...profile, phoneType: e.target.value })}
            className={`${inputClass} mb-6`}
          >
            <option>Mobile</option>
            <option>Home</option>
            <option>Work</option>
          </select>

          <button
            onClick={saveProfile}
            disabled={savingProfile}
            className="w-full bg-forest text-cream py-2.5 rounded-full hover:bg-forest-light disabled:opacity-50 mb-4"
          >
            {savingProfile ? "Saving..." : "Update"}
          </button>
          <button onClick={handleLogout} className="text-sm text-sage underline">
            Log out
          </button>
        </div>
      )}

      {tab === "Payment Settings" && (
        <div>
          <h2 className="font-display text-lg text-forest mb-2">Payment Method</h2>
          <p className="text-sm text-ink/70 mb-1">
            For your safety, always complete payments only through the Haven Paws platform.
          </p>
          <a href="/terms" className="text-sm text-forest border-b border-gold pb-0.5">
            Learn more
          </a>
          <div className="mt-6">
            <p className="text-sm text-ink/80 mb-2">No payment method on file yet.</p>
            <button className="border border-sage/30 text-forest px-5 py-2 rounded-full text-sm">
              Add payment method
            </button>
          </div>
        </div>
      )}

      {tab === "Notifications" && (
        <div>
          <h2 className="font-display text-lg text-forest mb-1">Email notifications</h2>
          <p className="text-sm text-ink/70 mb-4">Choose what you&apos;d like to hear from us about.</p>

          {[
            { key: "newsTips" as const, label: "News & Tips", desc: "Occasional stories and puppy-care tips" },
            { key: "favoritesUpdates" as const, label: "Updates on Your Favorites", desc: "Status changes on puppies you've viewed" },
            { key: "personalizedMatches" as const, label: "Personalized Matches", desc: "Puppies that match your preferences" },
            { key: "surveysFeedback" as const, label: "Surveys & Feedback", desc: "Occasional requests for your input" },
            { key: "ownerGuide" as const, label: "Your Puppy Owner Guide", desc: "Helpful guidance after your puppy arrives" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between py-3 border-b border-sage/10">
              <div>
                <p className="text-sm text-ink font-medium">{item.label}</p>
                <p className="text-xs text-sage">{item.desc}</p>
              </div>
              <input
                type="checkbox"
                checked={prefs[item.key]}
                onChange={(e) => setPrefs({ ...prefs, [item.key]: e.target.checked })}
                className="w-5 h-5"
              />
            </div>
          ))}

          <h2 className="font-display text-lg text-forest mb-1 mt-8">Text message notifications</h2>
          <div className="flex items-center justify-between py-3 border-b border-sage/10">
            <p className="text-sm text-ink font-medium">Puppy Search Updates</p>
            <input
              type="checkbox"
              checked={prefs.puppySearchSms}
              onChange={(e) => setPrefs({ ...prefs, puppySearchSms: e.target.checked })}
              className="w-5 h-5"
            />
          </div>

          <h2 className="font-display text-lg text-forest mb-3 mt-8">Preference settings</h2>

          <label className="block text-sm text-ink/80 mb-2">Breed Updates</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {prefs.breedUpdates.map((b) => (
              <span key={b} className="flex items-center gap-1 bg-cream-alt rounded-full px-3 py-1 text-xs">
                {b}
                <button onClick={() => removeBreed(b)} aria-label={`Remove ${b}`}>
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          <input
            value={breedInput}
            onChange={(e) => setBreedInput(e.target.value)}
            placeholder="Search a breed to add"
            className={`${inputClass} mb-1`}
          />
          {filteredBreedSuggestions.length > 0 && (
            <div className="border border-sage/20 rounded-md mb-3">
              {filteredBreedSuggestions.map((b) => (
                <button
                  key={b}
                  onClick={() => addBreed(b)}
                  className="block w-full text-left px-3 py-2 text-sm hover:bg-cream-alt"
                >
                  {b}
                </button>
              ))}
            </div>
          )}

          <label className="block text-sm text-ink/80 mb-1 mt-4">Gender Updates</label>
          <select
            value={prefs.genderUpdates}
            onChange={(e) => setPrefs({ ...prefs, genderUpdates: e.target.value })}
            className={`${inputClass} mb-4`}
          >
            <option value="any">Any</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <label className="block text-sm text-ink/80 mb-1">Location</label>
          <input
            value={prefs.location}
            onChange={(e) => setPrefs({ ...prefs, location: e.target.value })}
            placeholder="For nearby puppy alerts"
            className={`${inputClass} mb-4`}
          />

          <p className="text-xs text-sage mb-6">
            By updating your preferences, you consent to receive the communications selected
            above. You can update these settings anytime.
          </p>

          <button
            onClick={savePrefs}
            disabled={savingPrefs}
            className="w-full bg-forest text-cream py-2.5 rounded-full hover:bg-forest-light disabled:opacity-50"
          >
            {savingPrefs ? "Saving..." : "Update"}
          </button>
        </div>
      )}
    </div>
  );
}