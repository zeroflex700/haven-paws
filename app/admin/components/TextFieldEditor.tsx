"use client";

import { useState } from "react";
import { updatePageExtraText } from "../content/actions";

export default function TextFieldEditor({
  slug,
  textKey,
  label,
  currentValue,
  multiline,
}: {
  slug: string;
  textKey: string;
  label: string;
  currentValue: string;
  multiline?: boolean;
}) {
  const [value, setValue] = useState(currentValue);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    await updatePageExtraText(slug, textKey, value);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  const inputClass =
    "w-full border border-sage/30 rounded-md px-3 py-2 focus:outline-none focus:border-gold";

  return (
    <div className="mb-5">
      <p className="text-sm text-ink/80 mb-1">{label}</p>
      {multiline ? (
        <textarea value={value} onChange={(e) => setValue(e.target.value)} rows={4} className={`${inputClass} mb-2`} />
      ) : (
        <input value={value} onChange={(e) => setValue(e.target.value)} className={`${inputClass} mb-2`} />
      )}
      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-white border border-sage/30 text-sm text-forest px-4 py-1.5 rounded-full"
      >
        {saving ? "Saving..." : saved ? "Saved ✓" : "Save"}
      </button>
    </div>
  );
}