"use client";

import { useState } from "react";
import { Star, Trash2, Loader2 } from "lucide-react";

type StagedItem = {
  tempId: string;
  url: string;
  publicId: string;
  mediaType: "image" | "video";
  isCover: boolean;
};

function uploadToCloudinary(
  file: File,
  mediaType: "image" | "video",
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

    xhr.addEventListener("error", () =>
      reject(new Error("Network error during upload"))
    );

    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${mediaType}/upload`
    );
    xhr.send(formData);
  });
}

export default function StagedMediaUploader() {
  const [items, setItems] = useState<StagedItem[]>([]);
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
        const data = await uploadToCloudinary(file, mediaType, setProgress);

        setItems((current) => [
          ...current,
          {
            tempId: crypto.randomUUID(),
            url: data.secure_url,
            publicId: data.public_id,
            mediaType,
            isCover: current.length === 0,
          },
        ]);
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

  function removeItem(tempId: string) {
    setItems((current) => {
      const filtered = current.filter((item) => item.tempId !== tempId);

      // If the removed item was the cover, promote the new first item.
      if (
        filtered.length > 0 &&
        !filtered.some((item) => item.isCover)
      ) {
        filtered[0] = { ...filtered[0], isCover: true };
      }

      return filtered;
    });
  }

  function makeCover(tempId: string) {
    setItems((current) =>
      current.map((item) => ({
        ...item,
        isCover: item.tempId === tempId,
      }))
    );
  }

  const stagedPayload = JSON.stringify(
    items.map((item, index) => ({
      url: item.url,
      public_id: item.publicId,
      media_type: item.mediaType,
      is_cover: item.isCover,
      sort_order: index,
    }))
  );

  return (
    <div className="mt-4">
      <input type="hidden" name="staged_media" value={stagedPayload} />

      <label className="block bg-forest text-cream text-center py-3 rounded-full cursor-pointer hover:bg-forest-light transition-colors">
        {uploading
          ? `Uploading ${currentFile} — ${progress}%`
          : "Add Photos or Videos"}
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

      {items.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mt-4">
          {items.map((item) => (
            <div
              key={item.tempId}
              className="relative rounded-lg overflow-hidden border border-sage/20 bg-cream-alt aspect-square"
            >
              {item.mediaType === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={item.url}
                  muted
                  className="w-full h-full object-cover"
                />
              )}

              {item.isCover && (
                <span className="absolute top-1 left-1 bg-gold text-forest text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded">
                  Cover
                </span>
              )}

              <div className="absolute bottom-1 right-1 flex gap-1">
                <button
                  type="button"
                  onClick={() => makeCover(item.tempId)}
                  aria-label="Set as cover photo"
                  className="h-7 w-7 rounded-full bg-white/90 flex items-center justify-center"
                >
                  <Star
                    size={13}
                    className={
                      item.isCover
                        ? "fill-gold text-gold"
                        : "text-ink/50"
                    }
                  />
                </button>

                <button
                  type="button"
                  onClick={() => removeItem(item.tempId)}
                  aria-label="Remove"
                  className="h-7 w-7 rounded-full bg-white/90 flex items-center justify-center"
                >
                  <Trash2 size={13} className="text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {uploading && items.length === 0 && (
        <div className="mt-4 flex items-center gap-2 text-sm text-sage">
          <Loader2 size={14} className="animate-spin" />
          Preparing upload…
        </div>
      )}
    </div>
  );
}