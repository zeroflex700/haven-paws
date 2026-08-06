"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBreeder, updateBreeder, type BreederInput } from "../breeders/actions";
import { cldThumb } from "@/lib/cloudinary";
import type { Breeder } from "@/lib/queries/breeders";

type BreedOption = { id: string; name: string };

export default function BreederForm({
  breeder,
  breeds,
}: {
  breeder?: Breeder & { id: string; breedId?: string | null };
  breeds: BreedOption[];
}) {
  const router = useRouter();
  const [form, setForm] = useState<BreederInput>({
    name: breeder?.name ?? "",
    breedId: breeder?.breedId ?? null,
    photoUrl: breeder?.photoUrl ?? null,
    meetBreederText: breeder?.meetBreederText ?? "",
    meetBreederImageUrl: breeder?.meetBreederImageUrl ?? null,
    homeGalleryTitle: breeder?.homeGalleryTitle ?? "The Lovely Home",
    gettingAPuppyText: breeder?.gettingAPuppyText ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  function update<K extends keyof BreederInput>(key: K, value: BreederInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleImageUpload(field: "photoUrl" | "meetBreederImageUrl", file: File) {
    setUploadingKey(field);
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
      update(field, data.secure_url);
    } catch {
      alert("Image upload failed");
    }
    setUploadingKey(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (breeder?.id) {
        await updateBreeder(breeder.id, breeder.slug, form);
      } else {
        await createBreeder(form);
      }
    } catch {
      alert("Save failed");
      setSaving(false);
    }
  }

  const inputClass = "w-full border border-sage/30 rounded-md px-3 py-2 focus:outline-none focus:border-gold";
  const labelClass = "block text-sm text-ink/80 mb-1 mt-4";

  function ImageField({ field, label }: { field: "photoUrl" | "meetBreederImageUrl"; label: string }) {
    const url = form[field];
    return (
      <div className="mt-3">
        <p className="text-xs text-ink/70 mb-1">{label}</p>
        {url && (
          <div className="w-24 h-24 rounded-lg overflow-hidden bg-cream-alt mb-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cldThumb(url, 200)} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <label className="inline-block bg-white border border-sage/30 text-xs text-forest px-3 py-1 rounded-full cursor-pointer">
          {uploadingKey === field ? "Uploading..." : "Upload"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleImageUpload(field, e.target.files[0])}
          />
        </label>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="pb-16">
      <label className={labelClass}>Breeder Name</label>
      <input value={form.name} onChange={(e) => update("name", e.target.value)} required className={inputClass} />

      <label className={labelClass}>Breed</label>
      <select
        value={form.breedId ?? ""}
        onChange={(e) => update("breedId", e.target.value || null)}
        className={inputClass}
      >
        <option value="">Select a breed</option>
        {breeds.map((b) => (
          <option key={b.id} value={b.id}>{b.name}</option>
        ))}
      </select>

      <ImageField field="photoUrl" label="Profile Photo" />

      <h2 className="font-display text-lg text-forest mb-2 mt-8">Section 1 — Meet the Breeder</h2>
      <ImageField field="meetBreederImageUrl" label="Meet the Breeder Image" />
      <label className={labelClass}>Meet the Breeder — Text</label>
      <textarea
        value={form.meetBreederText}
        onChange={(e) => update("meetBreederText", e.target.value)}
        rows={5}
        className={inputClass}
      />

      <h2 className="font-display text-lg text-forest mb-2 mt-8">
        Section 12 — Home Gallery
      </h2>
      <label className={labelClass}>Section Title</label>
      <input
        value={form.homeGalleryTitle}
        onChange={(e) => update("homeGalleryTitle", e.target.value)}
        className={inputClass}
      />
      <p className="text-xs text-sage mt-1">
        Add the 6 photos after saving, from the breeder list.
      </p>

      <h2 className="font-display text-lg text-forest mb-2 mt-8">
        Section 4 — Getting a Puppy
      </h2>
      <label className={labelClass}>Getting a Puppy — Text</label>
      <textarea
        value={form.gettingAPuppyText}
        onChange={(e) => update("gettingAPuppyText", e.target.value)}
        rows={5}
        className={inputClass}
      />

      <div className="flex gap-3 mt-8">
        <button
          type="button"
          onClick={() => router.push("/admin/breeders")}
          className="flex-1 border border-sage/30 text-forest py-3 rounded-full"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex-1 bg-forest text-cream py-3 rounded-full hover:bg-forest-light disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Breeder"}
        </button>
      </div>
    </form>
  );
}