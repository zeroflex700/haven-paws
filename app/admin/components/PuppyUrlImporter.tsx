"use client";

import { useState } from "react";
import { importPuppyFromUrl } from "../puppies/import-actions";

export default function PuppyUrlImporter() {
  const [url, setUrl] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setError("");

    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      setError("Please paste a puppy listing URL.");
      return;
    }

    try {
      new URL(trimmedUrl);
    } catch {
      setError("Please enter a valid website URL.");
      return;
    }

    setIsImporting(true);

    try {
      const result = await importPuppyFromUrl(trimmedUrl);

      setMessage(
        `Imported ${result.name}. ${result.mediaCount} media item${
          result.mediaCount === 1 ? "" : "s"
        } found.`
      );

      setUrl("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to import puppy from this URL."
      );
    } finally {
      setIsImporting(false);
    }
  }

  return (
    <section className="mb-8 rounded-xl border border-sage/20 bg-white p-5">
      <p className="eyebrow mb-1">Quick Import</p>

      <h2 className="font-display text-xl text-forest">
        Import Puppy from Website
      </h2>

      <p className="text-sm text-ink/70 mt-2 mb-4">
        Paste a public puppy listing URL. We&apos;ll create the puppy and
        import any publicly discoverable photos or videos.
      </p>

      <form onSubmit={handleSubmit}>
        <label
          htmlFor="puppy-import-url"
          className="block text-sm text-ink/80 mb-1"
        >
          Puppy listing URL
        </label>

        <input
          id="puppy-import-url"
          type="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://www.puppyspot.com/puppies-for-sale..."
          disabled={isImporting}
          className="w-full border border-sage/30 rounded-md px-3 py-2 focus:outline-none focus:border-gold"
        />

        <button
          type="submit"
          disabled={isImporting}
          className="w-full bg-forest text-cream py-3 rounded-full mt-4 hover:bg-forest-light transition-colors disabled:opacity-50"
        >
          {isImporting ? "Importing..." : "Import Puppy"}
        </button>
      </form>

      {message && (
        <div className="mt-4 rounded-md bg-forest/5 border border-forest/20 px-3 py-2">
          <p className="text-sm text-forest">{message}</p>
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-md bg-red-50 border border-red-200 px-3 py-2">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </section>
  );
}