"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createReview, updateReview } from "../reviews/actions";
import { cldThumb } from "@/lib/cloudinary";

type ReviewData = {
  id?: string;
  customerName?: string;
  location?: string | null;
  rating?: number | null;
  reviewText?: string;
  photoUrl?: string | null;
  videoUrl?: string | null;
  verified?: boolean;
  isSpotlight?: boolean;
};

export default function ReviewForm({ review }: { review?: ReviewData }) {
  const router = useRouter();
  const [customerName, setCustomerName] = useState(review?.customerName ?? "");
  const [location, setLocation] = useState(review?.location ?? "");
  const [rating, setRating] = useState(review?.rating ?? 5);
  const [reviewText, setReviewText] = useState(review?.reviewText ?? "");
  const [verified, setVerified] = useState(review?.verified ?? true);
  const [isSpotlight, setIsSpotlight] = useState(review?.isSpotlight ?? false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(review?.photoUrl ?? null);
  const [videoUrl, setVideoUrl] = useState<string | null>(review?.videoUrl ?? null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [saving, setSaving] = useState(false);

  async function uploadToCloudinary(file: File, type: "image" | "video") {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${type}/upload`,
      { method: "POST", body: formData }
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || "Upload failed");
    return data.secure_url as string;
  }

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      setPhotoUrl(await uploadToCloudinary(file, "image"));
    } catch {
      alert("Photo upload failed");
    }
    setUploadingPhoto(false);
    e.target.value = "";
  }

  async function handleVideoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingVideo(true);
    try {
      setVideoUrl(await uploadToCloudinary(file, "video"));
    } catch {
      alert("Video upload failed");
    }
    setUploadingVideo(false);
    e.target.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const input = {
      customerName,
      location,
      rating,
      reviewText,
      photoUrl,
      videoUrl,
      verified,
      isSpotlight,
    };
    try {
      if (review?.id) {
        await updateReview(review.id, input);
      } else {
        await createReview(input);
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
      <label className="block text-sm text-ink/80 mb-1 mt-4">Customer Name</label>
      <input
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
        required
        className={inputClass}
      />

      <label className="block text-sm text-ink/80 mb-1 mt-4">Location</label>
      <input
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="e.g. Washington"
        className={inputClass}
      />

      <label className="block text-sm text-ink/80 mb-1 mt-4">Rating</label>
      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        className={inputClass}
      >
        {[5, 4, 3, 2, 1].map((n) => (
          <option key={n} value={n}>
            {n} star{n !== 1 ? "s" : ""}
          </option>
        ))}
      </select>

      <label className="block text-sm text-ink/80 mb-1 mt-4">Review Text</label>
      <textarea
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        required
        rows={5}
        className={inputClass}
      />

      <div className="mt-4">
        <p className="text-sm text-ink/80 mb-2">Photo (optional)</p>
        {photoUrl && (
          <div className="w-24 h-24 rounded-lg overflow-hidden bg-cream-alt mb-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cldThumb(photoUrl, 200)} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <label className="inline-block bg-white border border-sage/30 text-sm text-forest px-4 py-1.5 rounded-full cursor-pointer">
          {uploadingPhoto ? "Uploading..." : photoUrl ? "Replace Photo" : "Upload Photo"}
          <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
        </label>
      </div>

      <div className="mt-4">
        <p className="text-sm text-ink/80 mb-2">Video (optional)</p>
        {videoUrl && (
          <video src={videoUrl} controls className="w-40 h-24 rounded-lg bg-cream-alt mb-2" />
        )}
        <label className="inline-block bg-white border border-sage/30 text-sm text-forest px-4 py-1.5 rounded-full cursor-pointer">
          {uploadingVideo ? "Uploading..." : videoUrl ? "Replace Video" : "Upload Video"}
          <input type="file" accept="video/*" onChange={handleVideoChange} className="hidden" />
        </label>
      </div>

      <div className="flex items-center gap-2 mt-5">
        <input
          type="checkbox"
          checked={verified}
          onChange={(e) => setVerified(e.target.checked)}
          className="w-4 h-4"
          id="verified"
        />
        <label htmlFor="verified" className="text-sm text-ink/80">
          Show verified checkmark
        </label>
      </div>

      <div className="flex items-center gap-2 mt-3">
        <input
          type="checkbox"
          checked={isSpotlight}
          onChange={(e) => setIsSpotlight(e.target.checked)}
          className="w-4 h-4"
          id="spotlight"
        />
        <label htmlFor="spotlight" className="text-sm text-ink/80">
          Feature as spotlight review
        </label>
      </div>

      <div className="flex gap-3 mt-8">
        <button
          type="button"
          onClick={() => router.push("/admin/reviews")}
          className="flex-1 border border-sage/30 text-forest py-3 rounded-full"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving || uploadingPhoto || uploadingVideo}
          className="flex-1 bg-forest text-cream py-3 rounded-full hover:bg-forest-light disabled:opacity-50"
        >
          {saving ? "Saving..." : review?.id ? "Save Changes" : "Add Review"}
        </button>
      </div>
    </form>
  );
}