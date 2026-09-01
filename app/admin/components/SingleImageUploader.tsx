"use client";

import { useState } from "react";
import { Loader2, X } from "lucide-react";

function uploadImageToCloudinary(
  file: File,
  onProgress: (pct: number) => void
): Promise<{ secure_url: string }> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    );

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    });

    xhr.addEventListener("load", () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(data);
        } else {
          reject(new Error(data.error?.message || "Upload failed"));
        }
      } catch {
        reject(new Error("Upload failed"));
      }
    });

    xhr.addEventListener("error", () =>
      reject(new Error("Network error during upload"))
    );

    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`
    );
    xhr.send(formData);
  });
}

export default function SingleImageUploader({
  label,
  fieldName,
  value,
  onChange,
}: {
  label: string;
  fieldName: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    setProgress(0);

    try {
      const data = await uploadImageToCloudinary(file, setProgress);
      onChange(data.secure_url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    }

    setUploading(false);
    e.target.value = "";
  }

  return (
    <div className="mt-2">
      <input type="hidden" name={fieldName} value={value} />

      {value ? (
        <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-sage/20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt={label} className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Remove photo"
            className="absolute top-1 right-1 h-6 w-6 rounded-full bg-white/90 flex items-center justify-center"
          >
            <X size={12} className="text-red-600" />
          </button>
        </div>
      ) : (
        <label className="inline-flex items-center justify-center w-24 h-24 rounded-lg border border-dashed border-sage/30 text-xs text-sage cursor-pointer hover:bg-sage/5">
          {uploading ? (
            <span className="flex flex-col items-center gap-1">
              <Loader2 size={14} className="animate-spin" />
              {progress}%
            </span>
          ) : (
            "Add photo"
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            disabled={uploading}
            className="hidden"
          />
        </label>
      )}

      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}