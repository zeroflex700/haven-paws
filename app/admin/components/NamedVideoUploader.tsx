"use client";

import { useState } from "react";
import { updatePageExtraVideo } from "../content/actions";

export default function NamedVideoUploader({
  slug,
  videoKey,
  label,
  currentUrl,
}: {
  slug: string;
  videoKey: string;
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
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message);

      await updatePageExtraVideo(slug, videoKey, data.secure_url);
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
      {preview && <video src={preview} controls className="w-40 rounded-lg mb-2" />}
      <label className="inline-block bg-white border border-sage/30 text-sm text-forest px-4 py-1.5 rounded-full cursor-pointer">
        {uploading ? "Uploading..." : preview ? "Replace Video" : "Upload Video"}
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