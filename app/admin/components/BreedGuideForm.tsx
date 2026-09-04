"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { upsertBreedGuide, type BreedGuideInput } from "../breed-guides/actions";
import { SCORECARD_FIELDS, SCORECARD_GROUPS } from "@/lib/breedGuideFields";
import { cldThumb } from "@/lib/cloudinary";
import type { BreedGuide } from "@/lib/queries/breedGuides";
import BreedGuidePasteParser from "./BreedGuidePasteParser";
import type { ParsedBreedGuideData } from "../breed-guides/parse-actions";

type Breed = { id: string; name: string };

export default function BreedGuideForm({
  breedId,
  breedSlug,
  guide,
  allBreeds,
  initialFaqs = [],
  initialHealthIssues = [],
}: {
  breedId: string;
  breedSlug: string;
  guide: BreedGuide;
  allBreeds: Breed[];
  initialFaqs?: { question: string; answer: string }[];
  initialHealthIssues?: { subheading: string; body: string }[];
}) {
  const router = useRouter();
  const [form, setForm] = useState<BreedGuideInput>({
    heroImageUrl: guide.heroImageUrl,
    photoCredit: guide.photoCredit ?? "",
    authorName: guide.authorName ?? "",
    authorCredential: guide.authorCredential ?? "",
    authorPhotoUrl: guide.authorPhotoUrl,
    authorBio: guide.authorBio ?? "",
    overviewQuote: guide.overviewQuote ?? "",
    overviewSupport: guide.overviewSupport ?? "",
    whyPeopleLove: guide.whyPeopleLove ?? "",
    appearanceText: guide.appearanceText ?? "",
    appearanceImageUrl: guide.appearanceImageUrl,
    appearanceCredit: guide.appearanceCredit ?? "",
    groomingText: guide.groomingText ?? "",
    groomingImageUrl: guide.groomingImageUrl,
    groomingCredit: guide.groomingCredit ?? "",
    temperamentText: guide.temperamentText ?? "",
    exerciseText: guide.exerciseText ?? "",
    exerciseImageUrl: guide.exerciseImageUrl,
    exerciseCredit: guide.exerciseCredit ?? "",
    trainingText: guide.trainingText ?? "",
    dietText: guide.dietText ?? "",
    healthIntroText: guide.healthIntroText ?? "",
    historyText: guide.historyText ?? "",
    historyImageUrl: guide.historyImageUrl,
    historyImage2Url: guide.historyImage2Url,
    historyCredit: guide.historyCredit ?? "",
    scorecard: guide.scorecard ?? {},
    relatedBreedIds: guide.relatedBreedIds ?? [],
    faqs: initialFaqs.map((f) => ({ question: f.question, answer: f.answer })),
    healthIssues: initialHealthIssues.map((h) => ({ subheading: h.subheading, body: h.body })),
  });
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  function update<K extends keyof BreedGuideInput>(key: K, value: BreedGuideInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function updateScorecard(key: string, value: string) {
    setForm((f) => ({ ...f, scorecard: { ...f.scorecard, [key]: value } }));
  }

  function toggleRelated(id: string) {
    setForm((f) => ({
      ...f,
      relatedBreedIds: f.relatedBreedIds.includes(id)
        ? f.relatedBreedIds.filter((x) => x !== id)
        : [...f.relatedBreedIds, id],
    }));
  }

  function addFaq() {
    setForm((f) => ({ ...f, faqs: [...f.faqs, { question: "", answer: "" }] }));
  }
  function updateFaq(index: number, key: "question" | "answer", value: string) {
    setForm((f) => {
      const faqs = [...f.faqs];
      faqs[index] = { ...faqs[index], [key]: value };
      return { ...f, faqs };
    });
  }
  function removeFaq(index: number) {
    setForm((f) => ({ ...f, faqs: f.faqs.filter((_, i) => i !== index) }));
  }

  function addHealthIssue() {
    setForm((f) => ({ ...f, healthIssues: [...f.healthIssues, { subheading: "", body: "" }] }));
  }
  function updateHealthIssue(index: number, key: "subheading" | "body", value: string) {
    setForm((f) => {
      const healthIssues = [...f.healthIssues];
      healthIssues[index] = { ...healthIssues[index], [key]: value };
      return { ...f, healthIssues };
    });
  }
  function removeHealthIssue(index: number) {
    setForm((f) => ({ ...f, healthIssues: f.healthIssues.filter((_, i) => i !== index) }));
  }

  function handleParsed(data: ParsedBreedGuideData) {
    if (data.overviewQuote) update("overviewQuote", data.overviewQuote);
    if (data.overviewSupport) update("overviewSupport", data.overviewSupport);
    if (data.whyPeopleLove) update("whyPeopleLove", data.whyPeopleLove);
    if (data.appearanceText) update("appearanceText", data.appearanceText);
    if (data.groomingText) update("groomingText", data.groomingText);
    if (data.temperamentText) update("temperamentText", data.temperamentText);
    if (data.exerciseText) update("exerciseText", data.exerciseText);
    if (data.trainingText) update("trainingText", data.trainingText);
    if (data.dietText) update("dietText", data.dietText);
    if (data.healthIntroText) update("healthIntroText", data.healthIntroText);
    if (data.historyText) update("historyText", data.historyText);

    if (data.scorecard && Object.keys(data.scorecard).length > 0) {
      setForm((f) => ({
        ...f,
        scorecard: { ...f.scorecard, ...data.scorecard },
      }));
    }

    if (data.relatedBreedIds && data.relatedBreedIds.length > 0) {
      setForm((f) => ({ ...f, relatedBreedIds: data.relatedBreedIds }));
    }

    if (data.faqs && data.faqs.length > 0) {
      setForm((f) => ({ ...f, faqs: data.faqs }));
    }

    if (data.healthIssues && data.healthIssues.length > 0) {
      setForm((f) => ({ ...f, healthIssues: data.healthIssues }));
    }
  }

  async function handleImageUpload(field: keyof BreedGuideInput, file: File) {
    setUploadingKey(field);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message);
      update(field, data.secure_url as never);
    } catch {
      alert("Image upload failed");
    }
    setUploadingKey(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await upsertBreedGuide(breedId, breedSlug, form);
      router.push("/admin/breed-guides");
    } catch {
      alert("Save failed");
      setSaving(false);
    }
  }

  const inputClass =
    "w-full border border-sage/30 rounded-md px-3 py-2 focus:outline-none focus:border-gold";
  const labelClass = "block text-sm text-ink/80 mb-1 mt-4";

  function ImageField({ field, label }: { field: keyof BreedGuideInput; label: string }) {
    const url = form[field] as string | null;
    return (
      <div className="mt-3">
        <p className="text-xs text-ink/70 mb-1">{label}</p>
        {url && (
          <div className="w-24 h-24 rounded-lg overflow-hidden bg-cream-alt mb-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cldThumb(url, 200)} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <label className="inline-block bg-white border border-sage/30 text-xs text-forest px-3 py-1 rounded-full cursor-pointer">
          {uploadingKey === field ? "Uploading..." : "Upload"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleImageUpload(field, e.target.files[0])}
          />
        </label>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="pb-16">
      {!guide.id && (
        <BreedGuidePasteParser
          breedId={breedId}
          breedName={guide.breedName}
          onParsed={handleParsed}
        />
      )}

      <h2 className="font-display text-lg text-forest mb-2">Hero</h2>
      <ImageField field="heroImageUrl" label="Hero Image" />
      <label className={labelClass}>Photo Credit (optional)</label>
      <input value={form.photoCredit} onChange={(e) => update("photoCredit", e.target.value)} className={inputClass} />

      <h2 className="font-display text-lg text-forest mb-2 mt-8">Author</h2>
      <ImageField field="authorPhotoUrl" label="Author Photo" />
      <label className={labelClass}>Author Name</label>
      <input value={form.authorName} onChange={(e) => update("authorName", e.target.value)} className={inputClass} />
      <label className={labelClass}>Credential Line</label>
      <input value={form.authorCredential} onChange={(e) => update("authorCredential", e.target.value)} className={inputClass} />
      <label className={labelClass}>Author Bio</label>
      <textarea value={form.authorBio} onChange={(e) => update("authorBio", e.target.value)} rows={3} className={inputClass} />

      <h2 className="font-display text-lg text-forest mb-2 mt-8">Overview</h2>
      <label className={labelClass}>Pull-Quote</label>
      <textarea value={form.overviewQuote} onChange={(e) => update("overviewQuote", e.target.value)} rows={2} className={inputClass} />
      <label className={labelClass}>Supporting Sentence</label>
      <textarea value={form.overviewSupport} onChange={(e) => update("overviewSupport", e.target.value)} rows={2} className={inputClass} />

      <h2 className="font-display text-lg text-forest mb-2 mt-8">Article Sections</h2>

      <label className={labelClass}>Why People Love the Breed</label>
      <textarea value={form.whyPeopleLove} onChange={(e) => update("whyPeopleLove", e.target.value)} rows={4} className={inputClass} />

      <label className={labelClass}>Appearance</label>
      <textarea value={form.appearanceText} onChange={(e) => update("appearanceText", e.target.value)} rows={4} className={inputClass} />
      <ImageField field="appearanceImageUrl" label="Appearance Image" />
      <input placeholder="Photo credit (optional)" value={form.appearanceCredit} onChange={(e) => update("appearanceCredit", e.target.value)} className={`${inputClass} mt-2`} />

      <label className={labelClass}>Grooming</label>
      <textarea value={form.groomingText} onChange={(e) => update("groomingText", e.target.value)} rows={4} className={inputClass} />
      <ImageField field="groomingImageUrl" label="Grooming Image" />
      <input placeholder="Photo credit (optional)" value={form.groomingCredit} onChange={(e) => update("groomingCredit", e.target.value)} className={`${inputClass} mt-2`} />

      <label className={labelClass}>Breed Temperament and Characteristics</label>
      <textarea value={form.temperamentText} onChange={(e) => update("temperamentText", e.target.value)} rows={4} className={inputClass} />

      <label className={labelClass}>Exercise</label>
      <textarea value={form.exerciseText} onChange={(e) => update("exerciseText", e.target.value)} rows={4} className={inputClass} />
      <ImageField field="exerciseImageUrl" label="Exercise Image" />
      <input placeholder="Photo credit (optional)" value={form.exerciseCredit} onChange={(e) => update("exerciseCredit", e.target.value)} className={`${inputClass} mt-2`} />

      <label className={labelClass}>Training</label>
      <textarea value={form.trainingText} onChange={(e) => update("trainingText", e.target.value)} rows={4} className={inputClass} />

      <label className={labelClass}>Diet and Nutrition</label>
      <textarea value={form.dietText} onChange={(e) => update("dietText", e.target.value)} rows={4} className={inputClass} />

      <label className={labelClass}>Health Issues — Intro Paragraph</label>
      <textarea value={form.healthIntroText} onChange={(e) => update("healthIntroText", e.target.value)} rows={3} className={inputClass} />

      <div className="mt-4">
        {form.healthIssues.map((issue, i) => (
          <div key={i} className="bg-white border border-sage/20 rounded-lg p-4 mb-3">
            <label className="block text-xs text-ink/70 mb-1">Subheading</label>
            <input
              value={issue.subheading}
              onChange={(e) => updateHealthIssue(i, "subheading", e.target.value)}
              className={inputClass}
            />
            <label className="block text-xs text-ink/70 mb-1 mt-3">Description</label>
            <textarea
              value={issue.body}
              onChange={(e) => updateHealthIssue(i, "body", e.target.value)}
              rows={3}
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => removeHealthIssue(i)}
              className="text-xs text-red-600 mt-2"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addHealthIssue}
          className="text-sm text-forest border border-sage/30 rounded-full px-4 py-2 bg-white hover:border-gold"
        >
          + Add Health Issue
        </button>
      </div>

      <label className={labelClass}>History</label>
      <textarea value={form.historyText} onChange={(e) => update("historyText", e.target.value)} rows={4} className={inputClass} />
      <ImageField field="historyImageUrl" label="History Image 1" />
      <ImageField field="historyImage2Url" label="History Image 2 (optional)" />
      <input placeholder="Photo credit (optional)" value={form.historyCredit} onChange={(e) => update("historyCredit", e.target.value)} className={`${inputClass} mt-2`} />

      <h2 className="font-display text-lg text-forest mb-2 mt-8">Breed Scorecard</h2>
      {SCORECARD_GROUPS.map((group) => (
        <div key={group} className="mt-4">
          <p className="text-sm font-medium text-forest mb-2">{group}</p>
          {SCORECARD_FIELDS.filter((f) => f.group === group).map((field) => (
            <div key={field.key} className="mb-2">
              <label className="block text-xs text-ink/70 mb-1">{field.label}</label>
              {field.type === "score" ? (
                <select
                  value={form.scorecard[field.key] ?? ""}
                  onChange={(e) => updateScorecard(field.key, e.target.value)}
                  className={inputClass}
                >
                  <option value="">—</option>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n}/5</option>
                  ))}
                </select>
              ) : (
                <input
                  value={form.scorecard[field.key] ?? ""}
                  onChange={(e) => updateScorecard(field.key, e.target.value)}
                  className={inputClass}
                />
              )}
            </div>
          ))}
        </div>
      ))}

      <h2 className="font-display text-lg text-forest mb-2 mt-8">Related Breeds</h2>
      <p className="text-xs text-sage mb-2">Select breeds with their own guide to feature here.</p>
      <div className="max-h-48 overflow-y-auto border border-sage/20 rounded-lg p-3">
        {allBreeds
          .filter((b) => b.id !== breedId)
          .map((b) => (
            <label key={b.id} className="flex items-center gap-2 py-1 text-sm">
              <input
                type="checkbox"
                checked={form.relatedBreedIds.includes(b.id)}
                onChange={() => toggleRelated(b.id)}
              />
              {b.name}
            </label>
          ))}
      </div>

      <h2 className="font-display text-lg text-forest mb-2 mt-8">FAQs</h2>
      <div>
        {form.faqs.map((faq, i) => (
          <div key={i} className="bg-white border border-sage/20 rounded-lg p-4 mb-3">
            <label className="block text-xs text-ink/70 mb-1">Question</label>
            <input
              value={faq.question}
              onChange={(e) => updateFaq(i, "question", e.target.value)}
              className={inputClass}
            />
            <label className="block text-xs text-ink/70 mb-1 mt-3">Answer</label>
            <textarea
              value={faq.answer}
              onChange={(e) => updateFaq(i, "answer", e.target.value)}
              rows={3}
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => removeFaq(i)}
              className="text-xs text-red-600 mt-2"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addFaq}
          className="text-sm text-forest border border-sage/30 rounded-full px-4 py-2 bg-white hover:border-gold"
        >
          + Add FAQ
        </button>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full bg-forest text-cream py-3 rounded-full mt-8 hover:bg-forest-light disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Breed Guide"}
      </button>
    </form>
  );
}