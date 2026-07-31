import { getSettingsAdmin } from "@/lib/queries/settings";
import { updateSettings } from "./actions";

export default async function AdminSettingsPage() {
  const settings = await getSettingsAdmin();
  const inputClass =
    "w-full border border-sage/30 rounded-md px-3 py-2 focus:outline-none focus:border-gold";

  return (
    <main className="px-5 pt-6 pb-10">
      <p className="eyebrow mb-1">Haven Paws Admin</p>
      <h1 className="font-display text-2xl text-forest mb-6">Site Settings</h1>

      <form action={updateSettings}>
        <label className="block text-sm text-ink/80 mb-1">Breeder / Business Name</label>
        <input name="breeder_name" defaultValue={settings.breederName} className={`${inputClass} mb-4`} />

        <label className="block text-sm text-ink/80 mb-1">Tagline</label>
        <input name="tagline" defaultValue={settings.tagline} className={`${inputClass} mb-4`} />

        <label className="block text-sm text-ink/80 mb-1">Promise Statement</label>
        <textarea name="promise_text" defaultValue={settings.promiseText} rows={3} className={`${inputClass} mb-6`} />

        <label className="block text-sm text-ink/80 mb-1">Badge Text</label>
        <input name="badge_text" defaultValue={settings.badgeText} className={`${inputClass} mb-4`} />

        <label className="block text-sm text-ink/80 mb-1">Experience</label>
        <input name="years_experience" defaultValue={settings.yearsExperience} className={`${inputClass} mb-4`} />

        <label className="block text-sm text-ink/80 mb-1">Specialties</label>
        <input name="specialties" defaultValue={settings.specialties} className={`${inputClass} mb-4`} />

        <label className="block text-sm text-ink/80 mb-1">Bio</label>
        <textarea name="bio" defaultValue={settings.bio} rows={4} className={`${inputClass} mb-6`} />

        <h2 className="font-display text-lg text-forest mb-3">Customer Contact</h2>

        <label className="block text-sm text-ink/80 mb-1">Support Phone Number</label>
        <input
          name="support_phone"
          defaultValue={settings.supportPhone}
          placeholder="e.g. 866-306-6064"
          className={`${inputClass} mb-4`}
        />

        <label className="block text-sm text-ink/80 mb-1">Support Hours</label>
        <input name="support_hours" defaultValue={settings.supportHours} className={`${inputClass} mb-6`} />

        <h2 className="font-display text-lg text-forest mb-3">Breeder Contact</h2>

        <label className="block text-sm text-ink/80 mb-1">Breeder Relations Email</label>
        <input name="breeder_email" defaultValue={settings.breederEmail} className={`${inputClass} mb-4`} />

        <label className="block text-sm text-ink/80 mb-1">Breeder Office Hours</label>
        <textarea
          name="breeder_hours"
          defaultValue={settings.breederHours}
          rows={2}
          className={`${inputClass} mb-6`}
        />

        <h2 className="font-display text-lg text-forest mb-3">Social Media Links</h2>

        <label className="block text-sm text-ink/80 mb-1">Facebook URL</label>
        <input name="facebook_url" defaultValue={settings.facebookUrl} className={`${inputClass} mb-4`} />

        <label className="block text-sm text-ink/80 mb-1">Instagram URL</label>
        <input name="instagram_url" defaultValue={settings.instagramUrl} className={`${inputClass} mb-4`} />

        <label className="block text-sm text-ink/80 mb-1">YouTube URL</label>
        <input name="youtube_url" defaultValue={settings.youtubeUrl} className={`${inputClass} mb-4`} />

        <label className="block text-sm text-ink/80 mb-1">X / Twitter URL</label>
        <input name="twitter_url" defaultValue={settings.twitterUrl} className={`${inputClass} mb-4`} />

        <h2 className="font-display text-lg text-forest mb-3 mt-6">Checkout Pricing</h2>

        <label className="block text-sm text-ink/80 mb-1">Nationwide Delivery Fee ($)</label>
        <input
          name="delivery_fee"
          type="number"
          step="0.01"
          defaultValue={settings.deliveryFee}
          className={`${inputClass} mb-4`}
        />

        <label className="block text-sm text-ink/80 mb-1">Starter Care Kit Price ($)</label>
        <input
          name="starter_kit_price"
          type="number"
          step="0.01"
          defaultValue={settings.starterKitPrice}
          className={`${inputClass} mb-4`}
        />

        <label className="block text-sm text-ink/80 mb-1">Extended Health Guarantee Price ($)</label>
        <input
          name="health_guarantee_price"
          type="number"
          step="0.01"
          defaultValue={settings.healthGuaranteePrice}
          className={`${inputClass} mb-6`}
        />

        <button type="submit" className="w-full bg-forest text-cream py-2.5 rounded-full hover:bg-forest-light">
          Save
        </button>
      </form>
    </main>
  );
}