"use client";

import { useState } from "react";
import { addQualification } from "../breeders/content-actions";
import { cldThumb } from "@/lib/cloudinary";

export default function QualificationForm({
  breederId,
  breederSlug,
}: {
  breederId: string;
  breederSlug: string;
}) {
  const [badgeUrl, setBadgeUrl] = useState<string | null>(null);
  const [labelLine, setLabelLine] = useState("");
  const [titleLine, setTitleLine] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message);
      setBadgeUrl(data.secure_url);
    } catch {
      alert("Upload failed");
    }
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await addQualification(breederId, breederSlug, badgeUrl, labelLine, titleLine);
      setBadgeUrl(null);
      setLabelLine("");
      setTitleLine("");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Save failed");
    }
    setSaving(false);
  }

  const inputClass = "w-full border border-sage/30 rounded-md px-3 py-2 focus:outline-none focus:border-gold";

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-sage/20 rounded-lg p-4 mb-6">
      {badgeUrl && (
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-cream-alt mb-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cldThumb(badgeUrl, 150)} alt="" className="w-full h-full object-cover" />
        </div>
      )}
      <label className="inline-block bg-white border border-sage/30 text-sm text-forest px-4 py-1.5 rounded-full cursor-pointer mb-4">
        {uploading ? "Uploading..." : badgeUrl ? "Replace Badge" : "Upload Badge"}
        <input type="file" accept="image/*" onChange={handleFile} disabled={uploading} className="hidden" />
      </label>

      <label className="block text-sm text-ink/80 mb-1">Label Line</label>
      <input
        value={labelLine}
        onChange={(e) => setLabelLine(e.target.value)}
        placeholder="e.g. Recognized as a:"
        required
        className={`${inputClass} mb-3`}
      />

      <label className="block text-sm text-ink/80 mb-1">Title Line</label>
      <input
        value={titleLine}
        onChange={(e) => setTitleLine(e.target.value)}
        placeholder="e.g. State-Licensed Dog Breeder"
        required
        className={`${inputClass} mb-4`}
      />

      <button
        type="submit"
        disabled={saving || uploading}
        className="w-full bg-forest text-cream py-2.5 rounded-full hover:bg-forest-light disabled:opacity-50"
      >
        {saving ? "Saving..." : "Add Qualification"}
      </button>
    </form>
  );
}