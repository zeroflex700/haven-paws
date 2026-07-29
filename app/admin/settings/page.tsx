import { getSettingsAdmin } from "@/lib/queries/settings";
import { updateSettings } from "./actions";

export default async function AdminSettingsPage() {
  const settings = await getSettingsAdmin();
  const inputClass =
    "w-full border border-sage/30 rounded-md px-3 py-2 focus:outline-none focus:border-gold";

  return (
    <main className="px-5 pt-6 pb-10">
      <p className="eyebrow mb-1">Haven Paws Admin</p>
      <h1 className="font-display text-2xl text-forest mb-6">Breeder Info</h1>

      <form action={updateSettings}>
        <label className="block text-sm text-ink/80 mb-1">Breeder / Business Name</label>
        <input
          name="breeder_name"
          defaultValue={settings.breederName}
          className={`${inputClass} mb-4`}
        />

        <label className="block text-sm text-ink/80 mb-1">Badge Text</label>
        <input
          name="badge_text"
          defaultValue={settings.badgeText}
          placeholder="e.g. Verified Breeder"
          className={`${inputClass} mb-4`}
        />

        <label className="block text-sm text-ink/80 mb-1">Experience</label>
        <input
          name="years_experience"
          defaultValue={settings.yearsExperience}
          placeholder="e.g. 10+ years breeding experience"
          className={`${inputClass} mb-4`}
        />

        <label className="block text-sm text-ink/80 mb-1">Specialties</label>
        <input
          name="specialties"
          defaultValue={settings.specialties}
          placeholder="e.g. Golden Retriever, French Bulldog"
          className={`${inputClass} mb-4`}
        />

        <label className="block text-sm text-ink/80 mb-1">Bio</label>
        <textarea
          name="bio"
          defaultValue={settings.bio}
          rows={4}
          className={`${inputClass} mb-6`}
        />

        <button
          type="submit"
          className="w-full bg-forest text-cream py-2.5 rounded-full hover:bg-forest-light"
        >
          Save
        </button>
      </form>
    </main>
  );
}