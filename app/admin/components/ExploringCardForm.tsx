"use client";

import { useState } from "react";
import { createExploringCard } from "../exploring-cards/actions";
import { cldThumb } from "@/lib/cloudinary";

export default function ExploringCardForm() {
  const [caption, setCaption] = useState("");
  const [linkHref, setLinkHref] = useState("/puppies");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
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
      setImageUrl(data.secure_url);
    } catch {
      alert("Upload failed");
    }
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await createExploringCard(caption, linkHref, imageUrl);
    } catch {
      alert("Save failed");
      setSaving(false);
    }
  }

  const inputClass =
    "w-full border border-sage/30 rounded-md px-3 py-2 focus:outline-none focus:border-gold";

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-sage/20 rounded-lg p-4 mb-6">
      <h3 className="font-display text-lg text-forest mb-3">Add &quot;Keep Exploring&quot; Card</h3>

      <label className="block text-sm text-ink/80 mb-1">Caption</label>
      <input value={caption} onChange={(e) => setCaption(e.target.value)} required className={`${inputClass} mb-3`} />

      <label className="block text-sm text-ink/80 mb-1">Link (where tapping the card goes)</label>
      <input value={linkHref} onChange={(e) => setLinkHref(e.target.value)} className={`${inputClass} mb-4`} />

      <div className="mb-4">
        {imageUrl && (
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-cream-alt mb-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cldThumb(imageUrl, 150)} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <label className="inline-block bg-white border border-sage/30 text-sm text-forest px-4 py-1.5 rounded-full cursor-pointer">
          {uploading ? "Uploading..." : "Upload Image"}
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </label>
      </div>

      <button
        type="submit"
        disabled={saving || uploading}
        className="w-full bg-forest text-cream py-2.5 rounded-full hover:bg-forest-light disabled:opacity-50"
      >
        {saving ? "Saving..." : "Add Card"}
      </button>
    </form>
  );
}