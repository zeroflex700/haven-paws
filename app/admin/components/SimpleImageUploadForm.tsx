"use client";

import { useState } from "react";

export default function SimpleImageUploadForm({
  onUpload,
  label,
}: {
  onUpload: (url: string) => Promise<void>;
  label: string;
}) {
  const [uploading, setUploading] = useState(false);

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
      await onUpload(data.secure_url);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    }
    setUploading(false);
    e.target.value = "";
  }

  return (
    <label className="inline-block bg-forest text-cream text-sm px-4 py-2 rounded-full cursor-pointer">
      {uploading ? "Uploading..." : label}
      <input type="file" accept="image/*" onChange={handleFile} disabled={uploading} className="hidden" />
    </label>
  );
}