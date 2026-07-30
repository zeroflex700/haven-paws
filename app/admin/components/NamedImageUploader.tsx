"use client";

import { useState } from "react";
import { updatePageExtraImage } from "../content/actions";
import { cldThumb } from "@/lib/cloudinary";

export default function NamedImageUploader({
  slug,
  imageKey,
  label,
  currentUrl,
}: {
  slug: string;
  imageKey: string;
  label: string;
  currentUrl: string | null;
}) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentUrl);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    );

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message);

      await updatePageExtraImage(slug, imageKey, data.secure_url);
      setPreview(data.secure_url);
    } catch {
      alert("Upload failed, please try again.");
    }

    setUploading(false);
    e.target.value = "";
  }

  return (
    <div className="mb-6">
      <p className="text-sm text-ink/80 mb-2">{label}</p>
      <div className="w-32 h-32 rounded-lg overflow-hidden bg-cream-alt mb-2">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cldThumb(preview, 300)} alt="" className="w-full h-full object-contain" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sage text-xs text-center px-2">
            No image yet
          </div>
        )}
      </div>
      <label className="inline-block bg-white border border-sage/30 text-sm text-forest px-4 py-1.5 rounded-full cursor-pointer">
        {uploading ? "Uploading..." : "Upload"}
        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          disabled={uploading}
          className="hidden"
        />
      </label>
    </div>
  );
}