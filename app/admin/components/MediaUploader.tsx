"use client";

import { useState } from "react";
import { addMedia } from "../puppies/media-actions";

const CHUNK_SIZE = 6 * 1024 * 1024; // 6MB per chunk

function uploadImage(
  file: File,
  onProgress: (pct: number) => void
): Promise<{ secure_url: string; public_id: string }> {
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

    xhr.addEventListener("error", () => reject(new Error("Network error during upload")));

    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`
    );
    xhr.send(formData);
  });
}

async function uploadVideoChunked(
  file: File,
  onProgress: (pct: number) => void
): Promise<{ secure_url: string; public_id: string }> {
  const uniqueUploadId = `haven-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

  let lastResult: { secure_url: string; public_id: string } | null = null;

  for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
    const start = chunkIndex * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, file.size);
    const chunk = file.slice(start, end);

    const formData = new FormData();
    formData.append("file", chunk);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    );

    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const chunkFraction = event.loaded / event.total;
            const overallFraction = (chunkIndex + chunkFraction) / totalChunks;
            onProgress(Math.round(overallFraction * 100));
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
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`
        );

        xhr.setRequestHeader(
          "X-Unique-Upload-Id",
          uniqueUploadId
        );
        xhr.setRequestHeader(
          "Content-Range",
          `bytes ${start}-${end - 1}/${file.size}`
        );

        xhr.send(formData);
      }
    );

    lastResult = result;
  }

  if (!lastResult) {
    throw new Error("Upload failed: no chunks processed");
  }

  return lastResult;
}

export default function MediaUploader({ puppyId }: { puppyId: string }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState("");
  const [error, setError] = useState("");

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError("");

    for (const file of Array.from(files)) {
      const mediaType = file.type.startsWith("video") ? "video" : "image";

      setCurrentFile(file.name);
      setProgress(0);

      try {
        const data =
          mediaType === "video"
            ? await uploadVideoChunked(file, setProgress)
            : await uploadImage(file, setProgress);

        await addMedia(puppyId, data.secure_url, data.public_id, mediaType);
      } catch (err) {
        setError(
          `${file.name}: ${
            err instanceof Error ? err.message : "Upload failed"
          }`
        );
      }
    }

    setUploading(false);
    setProgress(0);
    setCurrentFile("");
    e.target.value = "";
  }

  return (
    <div className="mb-6">
      <label className="block bg-forest text-cream text-center py-3 rounded-full cursor-pointer hover:bg-forest-light transition-colors">
        {uploading
          ? `Uploading ${currentFile} — ${progress}%`
          : "Upload Photos or Videos"}
        <input
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleFiles}
          disabled={uploading}
          className="hidden"
        />
      </label>

      {uploading && (
        <div className="mt-2 h-1.5 w-full rounded-full bg-sage/15 overflow-hidden">
          <div
            className="h-full bg-gold transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
}