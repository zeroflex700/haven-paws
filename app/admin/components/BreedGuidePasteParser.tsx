"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import {
  parseBreedGuideText,
  type ParsedBreedGuideData,
} from "../breed-guides/parse-actions";

export default function BreedGuidePasteParser({
  breedId,
  breedName,
  onParsed,
}: {
  breedId: string;
  breedName: string;
  onParsed: (data: ParsedBreedGuideData) => void;
}) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleExtract() {
    setLoading(true);
    setError("");
    setSuccess(false);

    const result = await parseBreedGuideText(text, breedId, breedName);

    setLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    onParsed(result.data);
    setSuccess(true);
  }

  return (
    <div className="mb-6 rounded-lg border border-gold/40 bg-gold/5 p-4">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles size={16} className="text-gold" />
        <p className="text-sm font-medium text-forest">
          Paste an article about {breedName} to auto-fill this guide
        </p>
      </div>
      <p className="text-xs text-sage mb-2">
        Article sections are extracted from the text. The Scorecard and
        Related Breeds are filled using AI's general knowledge of the
        breed — review both carefully before saving.
      </p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste a breed article, wiki entry, or club description here…"
        rows={6}
        className="w-full border border-sage/30 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-gold bg-white"
      />

      <button
        type="button"
        onClick={handleExtract}
        disabled={loading || text.trim().length < 10}
        className="mt-2 inline-flex items-center gap-2 bg-forest text-cream text-sm px-4 py-2 rounded-full hover:bg-forest-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            Extracting…
          </>
        ) : (
          <>
            <Sparkles size={14} />
            Extract Information
          </>
        )}
      </button>

      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

      {success && (
        <p className="text-sm text-forest mt-2">
          ✓ Fields filled below, including Scorecard and Related Breeds.
          Review everything carefully before saving.
        </p>
      )}
    </div>
  );
}
EOF
echo "created BreedGuidePasteParser.tsx"