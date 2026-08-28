"use client";

import { useState } from "react";
import { addMedia, importMediaFromUrl } from "../puppies/media-actions";

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

    const cloudName =
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    if (!cloudName) {
      reject(
        new Error(
          "Cloudinary cloud name is not configured."
        )
      );
      return;
    }

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener(
      "progress",
      (event) => {
        if (event.lengthComputable) {
          onProgress(
            Math.round(
              (event.loaded / event.total) * 100
            )
          );
        }
      }
    );

    xhr.addEventListener("load", () => {
      try {
        const data = JSON.parse(
          xhr.responseText
        );

        if (
          xhr.status >= 200 &&
          xhr.status < 300
        ) {
          resolve(data);
        } else {
          reject(
            new Error(
              data.error?.message ||
                "Upload failed"
            )
          );
        }
      } catch {
        reject(
          new Error("Upload failed")
        );
      }
    });

    xhr.addEventListener(
      "error",
      () =>
        reject(
          new Error(
            "Network error during upload"
          )
        )
    );

    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${cloudName}/${mediaType}/upload`
    );

    xhr.send(formData);
  });
}

export default function MediaUploader({
  puppyId,
}: {
  puppyId: string;
}) {
  const [uploading, setUploading] =
    useState(false);

  const [progress, setProgress] =
    useState(0);

  const [currentFile, setCurrentFile] =
    useState("");

  const [error, setError] =
    useState("");

  const [websiteUrl, setWebsiteUrl] =
    useState("");

  const [importing, setImporting] =
    useState(false);

  const [importMessage, setImportMessage] =
    useState("");

  async function handleFiles(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const files = e.target.files;

    if (!files || files.length === 0) {
      return;
    }

    setUploading(true);
    setError("");
    setImportMessage("");

    for (const file of Array.from(files)) {
      const mediaType = file.type.startsWith(
        "video"
      )
        ? "video"
        : "image";

      setCurrentFile(file.name);
      setProgress(0);

      try {
        const data =
          await uploadToCloudinary(
            file,
            mediaType,
            setProgress
          );

        await addMedia(
          puppyId,
          data.secure_url,
          data.public_id,
          mediaType
        );
      } catch (err) {
        setError(
          `${file.name}: ${
            err instanceof Error
              ? err.message
              : "Upload failed"
          }`
        );
      }
    }

    setUploading(false);
    setProgress(0);
    setCurrentFile("");

    e.target.value = "";
  }

  async function handleWebsiteImport(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const url = websiteUrl.trim();

    if (!url) {
      setError(
        "Please paste a puppy website URL."
      );
      return;
    }

    setImporting(true);
    setError("");
    setImportMessage("");

    try {
      const result =
        await importMediaFromUrl(
          puppyId,
          url
        );

      if (result.imported === 0) {
        setError(
          result.message ||
            "No images or videos could be found on that page."
        );
      } else {
        setImportMessage(
          `Imported ${result.imported} ${
            result.imported === 1
              ? "media item"
              : "media items"
          }${
            result.skipped > 0
              ? ` (${result.skipped} already existed)`
              : ""
          }.`
        );

        setWebsiteUrl("");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not import media from that website."
      );
    } finally {
      setImporting(false);
    }
  }

  const busy =
    uploading || importing;

  return (
    <div className="mb-6 space-y-5">
      {/* Existing Cloudinary uploader */}
      <div>
        <label
          className={`block bg-forest text-cream text-center py-3 rounded-full transition-colors ${
            busy
              ? "opacity-60 cursor-not-allowed"
              : "cursor-pointer hover:bg-forest-light"
          }`}
        >
          {uploading
            ? `Uploading ${currentFile} — ${progress}%`
            : "Upload Photos or Videos"}

          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFiles}
            disabled={busy}
            className="hidden"
          />
        </label>

        {uploading && (
          <div className="mt-2 h-1.5 w-full rounded-full bg-sage/15 overflow-hidden">
            <div
              className="h-full bg-gold transition-all duration-200"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        )}
      </div>

      {/* Website importer */}
      <div className="border-t border-sage/20 pt-5">
        <p className="text-sm font-medium text-forest mb-1">
          Import from a puppy website
        </p>

        <p className="text-xs text-sage mb-3">
          Paste the URL of the puppy&apos;s
          webpage. Haven Paws will try to find
          the photos and videos on that page.
        </p>

        <form
          onSubmit={handleWebsiteImport}
          className="space-y-2"
        >
          <input
            type="url"
            value={websiteUrl}
            onChange={(e) =>
              setWebsiteUrl(e.target.value)
            }
            placeholder="https://www.puppyspot.com/puppies-for-sale-by-breeders/..."
            disabled={busy}
            className="w-full border border-sage/30 rounded-md px-3 py-2 focus:outline-none focus:border-gold"
          />

          <button
            type="submit"
            disabled={
              busy ||
              websiteUrl.trim().length === 0
            }
            className="w-full border border-forest text-forest py-2.5 rounded-full hover:bg-forest hover:text-cream transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {importing
              ? "Finding photos & videos..."
              : "Import Photos & Videos"}
          </button>
        </form>

        {importMessage && (
          <p className="text-sm text-forest mt-2">
            {importMessage}
          </p>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}