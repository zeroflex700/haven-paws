"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBreederFull } from "../breeders/actions";
import { cldThumb } from "@/lib/cloudinary";
import { ICON_OPTIONS, type IconKey } from "@/lib/breederIcons";
import { Trash2 } from "lucide-react";

type BreedOption = { id: string; name: string };

type QAEntry = { question: string; answer: string };
type IconTextEntry = { iconKey: string; heading: string; body: string };

async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
  );

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Upload failed");
  return data.secure_url;
}

export default function BreederFullForm({ breeds }: { breeds: BreedOption[] }) {
  const router = useRouter();

  // Basics
  const [name, setName] = useState("");
  const [breedId, setBreedId] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [meetBreederText, setMeetBreederText] = useState("");
  const [meetBreederImageUrl, setMeetBreederImageUrl] = useState<string | null>(null);
  const [homeGalleryTitle, setHomeGalleryTitle] = useState("The Lovely Home");
  const [gettingAPuppyText, setGettingAPuppyText] = useState("");

  // Staged lists
  const [homePhotoUrls, setHomePhotoUrls] = useState<string[]>([]);
  const [qa, setQa] = useState<QAEntry[]>([]);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [moreAbout, setMoreAbout] = useState<IconTextEntry[]>([]);
  const [healthTesting, setHealthTesting] = useState<IconTextEntry[]>([]);

  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const inputClass =
    "w-full border border-sage/30 rounded-md px-3 py-2 focus:outline-none focus:border-gold";
  const labelClass = "block text-sm text-ink/80 mb-1 mt-4";

  async function handleSingleUpload(
    key: string,
    onDone: (url: string) => void,
    file: File
  ) {
    setUploadingKey(key);
    try {
      const url = await uploadToCloudinary(file);
      onDone(url);
    } catch {
      alert("Image upload failed");
    }
    setUploadingKey(null);
  }

  async function handleMultiUpload(
    key: string,
    current: string[],
    setter: (urls: string[]) => void,
    file: File
  ) {
    setUploadingKey(key);
    try {
      const url = await uploadToCloudinary(file);
      setter([...current, url]);
    } catch {
      alert("Image upload failed");
    }
    setUploadingKey(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await createBreederFull({
        basics: {
          name,
          breedId,
          photoUrl,
          meetBreederText,
          meetBreederImageUrl,
          homeGalleryTitle,
          gettingAPuppyText,
        },
        homePhotoUrls,
        qa,
        photoUrls,
        moreAbout,
        healthTesting,
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Save failed");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="pb-16">
      {/* ============================================================= */}
      {/* BASICS                                                         */}
      {/* ============================================================= */}

      <h2 className="font-display text-lg text-forest mb-3">Basics</h2>

      <label className={labelClass}>Breeder Name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className={inputClass}
      />

      <label className={labelClass}>Breed</label>
      <select
        value={breedId ?? ""}
        onChange={(e) => setBreedId(e.target.value || null)}
        className={inputClass}
      >
        <option value="">Select a breed</option>
        {breeds.map((b) => (
          <option key={b.id} value={b.id}>{b.name}</option>
        ))}
      </select>

      <div className="mt-3">
        <p className="text-xs text-ink/70 mb-1">Profile Photo</p>
        {photoUrl && (
          <div className="w-24 h-24 rounded-lg overflow-hidden bg-cream-alt mb-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cldThumb(photoUrl, 200)} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <label className="inline-block bg-white border border-sage/30 text-xs text-forest px-3 py-1 rounded-full cursor-pointer">
          {uploadingKey === "photoUrl" ? "Uploading..." : "Upload"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) =>
              e.target.files?.[0] &&
              handleSingleUpload("photoUrl", setPhotoUrl, e.target.files[0])
            }
          />
        </label>
      </div>

      {/* ============================================================= */}
      {/* MEET THE BREEDER                                               */}
      {/* ============================================================= */}

      <h2 className="font-display text-lg text-forest mb-2 mt-8 pt-6 border-t border-sage/15">
        Meet the Breeder
      </h2>

      <div className="mt-3">
        <p className="text-xs text-ink/70 mb-1">Meet the Breeder Image</p>
        {meetBreederImageUrl && (
          <div className="w-24 h-24 rounded-lg overflow-hidden bg-cream-alt mb-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cldThumb(meetBreederImageUrl, 200)} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <label className="inline-block bg-white border border-sage/30 text-xs text-forest px-3 py-1 rounded-full cursor-pointer">
          {uploadingKey === "meetBreederImageUrl" ? "Uploading..." : "Upload"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) =>
              e.target.files?.[0] &&
              handleSingleUpload(
                "meetBreederImageUrl",
                setMeetBreederImageUrl,
                e.target.files[0]
              )
            }
          />
        </label>
      </div>

      <label className={labelClass}>Meet the Breeder — Text</label>
      <textarea
        value={meetBreederText}
        onChange={(e) => setMeetBreederText(e.target.value)}
        rows={5}
        className={inputClass}
      />

      {/* ============================================================= */}
      {/* HOME GALLERY                                                   */}
      {/* ============================================================= */}

      <h2 className="font-display text-lg text-forest mb-2 mt-8 pt-6 border-t border-sage/15">
        Home Gallery ({homePhotoUrls.length}/6)
      </h2>

      <label className={labelClass}>Section Title</label>
      <input
        value={homeGalleryTitle}
        onChange={(e) => setHomeGalleryTitle(e.target.value)}
        className={inputClass}
      />

      <div className="grid grid-cols-3 gap-2 mt-3">
        {homePhotoUrls.map((url, index) => (
          <div key={url} className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cldThumb(url, 200)} alt="" className="w-full aspect-square object-cover rounded-lg" />
            <button
              type="button"
              onClick={() =>
                setHomePhotoUrls(homePhotoUrls.filter((_, i) => i !== index))
              }
              className="absolute top-1 right-1 h-6 w-6 rounded-full bg-white/90 flex items-center justify-center"
            >
              <Trash2 size={12} className="text-red-600" />
            </button>
          </div>
        ))}
      </div>

      {homePhotoUrls.length < 6 && (
        <label className="inline-block bg-forest text-cream text-sm px-4 py-2 rounded-full cursor-pointer mt-3">
          {uploadingKey === "homePhoto" ? "Uploading..." : "Upload Home Photo"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) =>
              e.target.files?.[0] &&
              handleMultiUpload(
                "homePhoto",
                homePhotoUrls,
                setHomePhotoUrls,
                e.target.files[0]
              )
            }
          />
        </label>
      )}

      {/* ============================================================= */}
      {/* GETTING A PUPPY                                                */}
      {/* ============================================================= */}

      <h2 className="font-display text-lg text-forest mb-2 mt-8 pt-6 border-t border-sage/15">
        Getting a Puppy
      </h2>

      <label className={labelClass}>Getting a Puppy — Text</label>
      <textarea
        value={gettingAPuppyText}
        onChange={(e) => setGettingAPuppyText(e.target.value)}
        rows={5}
        className={inputClass}
      />

      {/* ============================================================= */}
      {/* Q&A                                                            */}
      {/* ============================================================= */}

      <h2 className="font-display text-lg text-forest mb-4 mt-8 pt-6 border-t border-sage/15">
        Q. &amp; A.
      </h2>

      <QAStaging qa={qa} setQa={setQa} inputClass={inputClass} />

      {/* ============================================================= */}
      {/* PHOTO STRIP                                                    */}
      {/* ============================================================= */}

      <h2 className="font-display text-lg text-forest mb-1 mt-8 pt-6 border-t border-sage/15">
        Photo Strip
      </h2>
      <p className="text-sm text-sage mb-4">Unbounded — add as many as you like.</p>

      <div className="grid grid-cols-3 gap-2 mb-3">
        {photoUrls.map((url, index) => (
          <div key={url} className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cldThumb(url, 200)} alt="" className="w-full aspect-square object-cover rounded-lg" />
            <button
              type="button"
              onClick={() => setPhotoUrls(photoUrls.filter((_, i) => i !== index))}
              className="absolute top-1 right-1 h-6 w-6 rounded-full bg-white/90 flex items-center justify-center"
            >
              <Trash2 size={12} className="text-red-600" />
            </button>
          </div>
        ))}
      </div>

      <label className="inline-block bg-forest text-cream text-sm px-4 py-2 rounded-full cursor-pointer">
        {uploadingKey === "photoStrip" ? "Uploading..." : "Upload Photo"}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) =>
            e.target.files?.[0] &&
            handleMultiUpload("photoStrip", photoUrls, setPhotoUrls, e.target.files[0])
          }
        />
      </label>

      {/* ============================================================= */}
      {/* MORE ABOUT                                                     */}
      {/* ============================================================= */}

      <h2 className="font-display text-lg text-forest mb-4 mt-8 pt-6 border-t border-sage/15">
        More About
      </h2>

      <IconTextStaging
        entries={moreAbout}
        setEntries={setMoreAbout}
        inputClass={inputClass}
        addLabel="Add Entry"
      />

      {/* ============================================================= */}
      {/* HEALTH TESTING                                                 */}
      {/* ============================================================= */}

      <h2 className="font-display text-lg text-forest mb-4 mt-8 pt-6 border-t border-sage/15">
        Parent Health Testing
      </h2>

      <IconTextStaging
        entries={healthTesting}
        setEntries={setHealthTesting}
        inputClass={inputClass}
        addLabel="Add Entry"
      />

      <div className="flex gap-3 mt-10">
        <button
          type="button"
          onClick={() => router.push("/admin/breeders")}
          className="flex-1 border border-sage/30 text-forest py-3 rounded-full"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex-1 bg-forest text-cream py-3 rounded-full hover:bg-forest-light disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Breeder"}
        </button>
      </div>
    </form>
  );
}

function QAStaging({
  qa,
  setQa,
  inputClass,
}: {
  qa: QAEntry[];
  setQa: (qa: QAEntry[]) => void;
  inputClass: string;
}) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  function add() {
    if (!question.trim() || !answer.trim()) return;
    setQa([...qa, { question, answer }]);
    setQuestion("");
    setAnswer("");
  }

  return (
    <div>
      <div className="bg-white border border-sage/20 rounded-lg p-4 mb-6">
        <label className="block text-sm text-ink/80 mb-1">Question</label>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className={`${inputClass} mb-3`}
        />
        <label className="block text-sm text-ink/80 mb-1">Answer</label>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows={3}
          className={`${inputClass} mb-4`}
        />
        <button
          type="button"
          onClick={add}
          className="w-full bg-forest text-cream py-2.5 rounded-full hover:bg-forest-light"
        >
          Add Q&amp;A
        </button>
      </div>

      {qa.map((item, index) => (
        <div key={index} className="flex justify-between items-start bg-white border border-sage/20 rounded-lg p-4 mb-3">
          <div>
            <p className="text-forest font-medium">{item.question}</p>
            <p className="text-sm text-ink/70">{item.answer}</p>
          </div>
          <button
            type="button"
            onClick={() => setQa(qa.filter((_, i) => i !== index))}
            className="text-sm text-red-500"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}

function IconTextStaging({
  entries,
  setEntries,
  inputClass,
  addLabel,
}: {
  entries: IconTextEntry[];
  setEntries: (entries: IconTextEntry[]) => void;
  inputClass: string;
  addLabel: string;
}) {
  const [iconKey, setIconKey] = useState<IconKey>(ICON_OPTIONS[0]?.key ?? "award");
  const [heading, setHeading] = useState("");
  const [body, setBody] = useState("");

  function add() {
    if (!heading.trim() || !body.trim()) return;
    setEntries([...entries, { iconKey, heading, body }]);
    setHeading("");
    setBody("");
  }

  return (
    <div>
      <div className="bg-white border border-sage/20 rounded-lg p-4 mb-6">
        <label className="block text-sm text-ink/80 mb-1">Icon</label>
        <select
          value={iconKey}
          onChange={(e) => setIconKey(e.target.value as IconKey)}
          className={`${inputClass} mb-3`}
        >
          {ICON_OPTIONS.map((o) => (
            <option key={o.key} value={o.key}>{o.label}</option>
          ))}
        </select>
        <label className="block text-sm text-ink/80 mb-1">Heading</label>
        <input
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
          className={`${inputClass} mb-3`}
        />
        <label className="block text-sm text-ink/80 mb-1">Body</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          className={`${inputClass} mb-4`}
        />
        <button
          type="button"
          onClick={add}
          className="w-full bg-forest text-cream py-2.5 rounded-full hover:bg-forest-light"
        >
          {addLabel}
        </button>
      </div>

      {entries.map((item, index) => (
        <div key={index} className="flex justify-between items-start bg-white border border-sage/20 rounded-lg p-4 mb-3">
          <div>
            <p className="text-forest font-medium">{item.heading}</p>
            <p className="text-sm text-ink/70">{item.body}</p>
          </div>
          <button
            type="button"
            onClick={() => setEntries(entries.filter((_, i) => i !== index))}
            className="text-sm text-red-500"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}