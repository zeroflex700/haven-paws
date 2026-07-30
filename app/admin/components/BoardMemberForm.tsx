"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBoardMember, updateBoardMember } from "../board/actions";
import { cldThumb } from "@/lib/cloudinary";

export default function BoardMemberForm({
  member,
}: {
  member?: { id?: string; name?: string; title?: string | null; photoUrl?: string | null };
}) {
  const router = useRouter();
  const [name, setName] = useState(member?.name ?? "");
  const [title, setTitle] = useState(member?.title ?? "");
  const [photoUrl, setPhotoUrl] = useState<string | null>(member?.photoUrl ?? null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
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
      setPhotoUrl(data.secure_url);
    } catch {
      alert("Upload failed");
    }
    setUploading(false);
    e.target.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (member?.id) {
        await updateBoardMember(member.id, name, title, photoUrl);
      } else {
        await createBoardMember(name, title, photoUrl);
      }
    } catch {
      alert("Save failed");
      setSaving(false);
    }
  }

  const inputClass =
    "w-full border border-sage/30 rounded-md px-3 py-2 focus:outline-none focus:border-gold";

  return (
    <form onSubmit={handleSubmit} className="pb-10">
      <div className="mb-4">
        {photoUrl && (
          <div className="w-24 h-24 rounded-full overflow-hidden bg-cream-alt mb-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cldThumb(photoUrl, 200)} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <label className="inline-block bg-white border border-sage/30 text-sm text-forest px-4 py-1.5 rounded-full cursor-pointer">
          {uploading ? "Uploading..." : "Upload Photo"}
          <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
        </label>
      </div>

      <label className="block text-sm text-ink/80 mb-1">Name</label>
      <input value={name} onChange={(e) => setName(e.target.value)} required className={`${inputClass} mb-4`} />

      <label className="block text-sm text-ink/80 mb-1">Title</label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g. DVM, Private Practice"
        className={`${inputClass} mb-6`}
      />

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => router.push("/admin/board")}
          className="flex-1 border border-sage/30 text-forest py-3 rounded-full"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving || uploading}
          className="flex-1 bg-forest text-cream py-3 rounded-full hover:bg-forest-light disabled:opacity-50"
        >
          {saving ? "Saving..." : member?.id ? "Save Changes" : "Add Member"}
        </button>
      </div>
    </form>
  );
}