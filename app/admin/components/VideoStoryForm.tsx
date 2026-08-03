"use client";

import { useState } from "react";
import { createVideoStory } from "../video-stories/actions";
import { cldThumb } from "@/lib/cloudinary";

export default function VideoStoryForm() {
  const [personName, setPersonName] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [saving, setSaving] = useState(false);

  async function uploadFile(file: File, type: "image" | "video") {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${type}/upload`,
      { method: "POST", body: formData }
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message);
    return data.secure_url as string;
  }

  async function handleThumb(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingThumb(true);
    try {
      setThumbnailUrl(await uploadFile(file, "image"));
    } catch {
      alert("Thumbnail upload failed");
    }
    setUploadingThumb(false);
  }

  async function handleVideo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingVideo(true);
    try {
      setVideoUrl(await uploadFile(file, "video"));
    } catch {
      alert("Video upload failed");
    }
    setUploadingVideo(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await createVideoStory(personName, description, thumbnailUrl, videoUrl);
    } catch {
      alert("Save failed");
      setSaving(false);
    }
  }

  const inputClass =
    "w-full border border-sage/30 rounded-md px-3 py-2 focus:outline-none focus:border-gold";

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-sage/20 rounded-lg p-4 mb-6">
      <h3 className="font-display text-lg text-forest mb-3">Add Video Story</h3>

      <label className="block text-sm text-ink/80 mb-1">Person / Breeder Name</label>
      <input value={personName} onChange={(e) => setPersonName(e.target.value)} required className={`${inputClass} mb-3`} />

      <label className="block text-sm text-ink/80 mb-1">Description</label>
      <input value={description} onChange={(e) => setDescription(e.target.value)} className={`${inputClass} mb-4`} />

      <div className="mb-3">
        {thumbnailUrl && (
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-cream-alt mb-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cldThumb(thumbnailUrl, 150)} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <label className="inline-block bg-white border border-sage/30 text-sm text-forest px-4 py-1.5 rounded-full cursor-pointer">
          {uploadingThumb ? "Uploading..." : "Upload Thumbnail"}
          <input type="file" accept="image/*" onChange={handleThumb} className="hidden" />
        </label>
      </div>

      <div className="mb-4">
        {videoUrl && <video src={videoUrl} controls className="w-32 rounded-lg mb-2" />}
        <label className="inline-block bg-white border border-sage/30 text-sm text-forest px-4 py-1.5 rounded-full cursor-pointer">
          {uploadingVideo ? "Uploading..." : "Upload Video"}
          <input type="file" accept="video/*" onChange={handleVideo} className="hidden" />
        </label>
      </div>

      <button
        type="submit"
        disabled={saving || uploadingThumb || uploadingVideo}
        className="w-full bg-forest text-cream py-2.5 rounded-full hover:bg-forest-light disabled:opacity-50"
      >
        {saving ? "Saving..." : "Add Story"}
      </button>
    </form>
  );
}