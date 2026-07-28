"use client";

import { useState } from "react";
import { addMedia } from "../puppies/media-actions";

export default function MediaUploader({ puppyId }: { puppyId: string }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError("");

    for (const file of Array.from(files)) {
      const mediaType = file.type.startsWith("video") ? "video" : "image";
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
      );

      try {
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${
            mediaType === "video" ? "video" : "image"
          }/upload`,
          { method: "POST", body: formData }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.error?.message || "Upload failed");

        await addMedia(puppyId, data.secure_url, data.public_id, mediaType);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      }
    }

    setUploading(false);
    e.target.value = "";
  }

  return (
    <div className="mb-6">
      <label className="block bg-forest text-cream text-center py-3 rounded-full cursor-pointer hover:bg-forest-light transition-colors">
        {uploading ? "Uploading..." : "Upload Photos or Videos"}
        <input
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleFiles}
          disabled={uploading}
          className="hidden"
        />
      </label>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
}