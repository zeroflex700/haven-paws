"use client";

import { useState } from "react";
import { updatePageHeroVideo } from "../content/actions";

export default function PageHeroVideoUploader({
  slug,
  currentUrl,
}: {
  slug: string;
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
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message);

      await updatePageHeroVideo(slug, data.secure_url);
      setPreview(data.secure_url);
    } catch {
      alert("Upload failed, please try again.");
    }

    setUploading(false);
    e.target.value = "";
  }

  return (
    <div className="mb-6">
      {preview && <video src={preview} controls className="w-full rounded-lg mb-2" />}
      <label className="inline-block bg-forest text-cream text-sm px-4 py-2 rounded-full cursor-pointer">
        {uploading ? "Uploading..." : "Upload Hero Video"}
        <input
          type="file"
          accept="video/*"
          onChange={handleFile}
          disabled={uploading}
          className="hidden"
        />
      </label>
    </div>
  );
}