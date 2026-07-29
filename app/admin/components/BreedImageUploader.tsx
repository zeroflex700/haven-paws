"use client";

import { useState } from "react";
import { updateBreedImage } from "../breeds/actions";
import { cldThumb } from "@/lib/cloudinary";

export default function BreedImageUploader({
  breedId,
  currentUrl,
}: {
  breedId: string;
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

      await updateBreedImage(breedId, data.secure_url);
      setPreview(data.secure_url);
    } catch {
      alert("Upload failed, please try again.");
    }

    setUploading(false);
    e.target.value = "";
  }

  return (
    <div className="mb-5">
      <div className="w-full aspect-video rounded-lg overflow-hidden bg-cream-alt mb-2">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cldThumb(preview, 600)} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sage text-xs">
            No breed photo
          </div>
        )}
      </div>
      <label className="inline-block bg-white border border-sage/30 text-sm text-forest px-4 py-1.5 rounded-full cursor-pointer">
        {uploading ? "Uploading..." : "Upload Breed Photo"}
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