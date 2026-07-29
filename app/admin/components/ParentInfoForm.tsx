"use client";

import { useState } from "react";
import { updateParentInfo } from "../puppies/parent-actions";
import ParentPhotoUploader from "./ParentPhotoUploader";

type ParentData = {
  name: string | null;
  breed: string | null;
  weight: string | null;
  registration: string | null;
  photoUrl: string | null;
};

export default function ParentInfoForm({
  puppyId,
  role,
  data,
}: {
  puppyId: string;
  role: "mom" | "dad";
  data: ParentData;
}) {
  const [saving, setSaving] = useState(false);
  const inputClass =
    "w-full border border-sage/30 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-gold";

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    await updateParentInfo(puppyId, role, {
      name: formData.get("name") as string,
      breed: formData.get("breed") as string,
      weight: formData.get("weight") as string,
      registration: formData.get("registration") as string,
    });
    setSaving(false);
  }

  return (
    <div className="bg-white border border-sage/20 rounded-lg p-4 mb-4">
      <h3 className="font-display text-lg text-forest mb-3 capitalize">{role}</h3>

      <ParentPhotoUploader puppyId={puppyId} role={role} currentUrl={data.photoUrl} />

      <form action={handleSubmit}>
        <label className="block text-xs text-ink/70 mb-1">Name</label>
        <input name="name" defaultValue={data.name ?? ""} className={`${inputClass} mb-3`} />

        <label className="block text-xs text-ink/70 mb-1">Breed</label>
        <input name="breed" defaultValue={data.breed ?? ""} className={`${inputClass} mb-3`} />

        <label className="block text-xs text-ink/70 mb-1">Weight</label>
        <input
          name="weight"
          defaultValue={data.weight ?? ""}
          placeholder="e.g. 5-6 lbs"
          className={`${inputClass} mb-3`}
        />

        <label className="block text-xs text-ink/70 mb-1">Registration</label>
        <input
          name="registration"
          defaultValue={data.registration ?? ""}
          placeholder="e.g. AKC registered"
          className={`${inputClass} mb-3`}
        />

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-forest text-cream py-2 rounded-full text-sm hover:bg-forest-light disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save " + role}
        </button>
      </form>
    </div>
  );
}