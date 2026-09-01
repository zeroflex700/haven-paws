import Link from "next/link";
import { getBreederAdmin, getBreederHomePhotos } from "@/lib/queries/breeders";
import { createClient } from "@/lib/supabase/server";
import {
  addHomePhoto,
  deleteHomePhoto,
  addBreederQA,
  deleteBreederQA,
  addBreederPhoto,
  deleteBreederPhoto,
  addIncludedItem,
  deleteIncludedItem,
  addMoreAbout,
  deleteMoreAbout,
  deleteQualification,
  addHealthTesting,
  deleteHealthTesting,
} from "../content-actions";
import BreederForm from "../../components/BreederForm";
import SimpleImageUploadForm from "../../components/SimpleImageUploadForm";
import DeleteGenericButton from "../../components/DeleteGenericButton";
import QualificationForm from "../../components/QualificationForm";
import { ICON_OPTIONS, CATEGORY_META, CATEGORY_ORDER } from "@/lib/breederIcons";
import { notFound } from "next/navigation";

export default async function EditBreederPage({
  params,
}: {
  params: Promise<{ breederId: string }>;
}) {
  const { breederId } = await params;
  const breeder = await getBreederAdmin(breederId);
  if (!breeder) notFound();

  const breederName = breeder.name;
  const breederSlug = breeder.slug;

  const supabase = await createClient();

  const [
    { data: breeds },
    { data: rawBreeder },
    homePhotos,
    { data: qaItems },
    { data: photos },
    { data: includedItems },
    { data: moreAboutItems },
    { data: qualifications },
    { data: healthTestingItems },
  ] = await Promise.all([
    supabase.from("breeds").select("id, name").order("name"),
    supabase.from("breeders").select("breed_id").eq("id", breederId).single(),
    getBreederHomePhotos(breederId),
    supabase
      .from("breeder_qa")
      .select("id, question, answer")
      .eq("breeder_id", breederId)
      .order("sort_order"),
    supabase
      .from("breeder_photos")
      .select("id, image_url")
      .eq("breeder_id", breederId)
      .order("sort_order"),
    supabase
      .from("breeder_included_items")
      .select("id, category, label")
      .eq("breeder_id", breederId)
      .order("sort_order"),
    supabase
      .from("breeder_more_about")
      .select("id, icon_key, heading, body")
      .eq("breeder_id", breederId)
      .order("sort_order"),
    supabase
      .from("breeder_qualifications")
      .select("id, badge_image_url, label_line, title_line")
      .eq("breeder_id", breederId)
      .order("sort_order"),
    supabase
      .from("breeder_health_testing")
      .select("id, icon_key, heading, body")
      .eq("breeder_id", breederId)
      .order("sort_order"),
  ]);

  /* ============================================================= */
  /* SERVER ACTIONS — bound to this breeder/slug                    */
  /* ============================================================= */

  const uploadHomePhoto = async (url: string) => {
    "use server";
    await addHomePhoto(breederId, breederSlug, url);
  };
  const removeHomePhoto = async (id: string) => {
    "use server";
    await deleteHomePhoto(id, breederSlug);
  };

  const removeQA = async (id: string) => {
    "use server";
    await deleteBreederQA(id, breederSlug);
  };
  async function handleAddQA(formData: FormData) {
    "use server";
    await addBreederQA(
      breederId,
      breederSlug,
      formData.get("question") as string,
      formData.get("answer") as string
    );
  }

  const uploadPhoto = async (url: string) => {
    "use server";
    await addBreederPhoto(breederId, breederSlug, url);
  };
  const removePhoto = async (id: string) => {
    "use server";
    await deleteBreederPhoto(id, breederSlug);
  };

  const removeIncludedItem = async (id: string) => {
    "use server";
    await deleteIncludedItem(id, breederSlug);
  };
  async function handleAddIncludedItem(formData: FormData) {
    "use server";
    await addIncludedItem(
      breederId,
      breederSlug,
      formData.get("category") as string,
      formData.get("label") as string
    );
  }

  const removeMoreAbout = async (id: string) => {
    "use server";
    await deleteMoreAbout(id, breederSlug);
  };
  async function handleAddMoreAbout(formData: FormData) {
    "use server";
    await addMoreAbout(
      breederId,
      breederSlug,
      formData.get("icon_key") as string,
      formData.get("heading") as string,
      formData.get("body") as string
    );
  }

  const removeQualification = async (id: string) => {
    "use server";
    await deleteQualification(id, breederSlug);
  };

  const removeHealthTesting = async (id: string) => {
    "use server";
    await deleteHealthTesting(id, breederSlug);
  };
  async function handleAddHealthTesting(formData: FormData) {
    "use server";
    await addHealthTesting(
      breederId,
      breederSlug,
      formData.get("icon_key") as string,
      formData.get("heading") as string,
      formData.get("body") as string
    );
  }

  const qualificationCount = qualifications?.length ?? 0;

  const sectionLinkClass =
    "text-xs text-forest border border-sage/20 rounded-full px-3 py-1.5 bg-white hover:border-gold transition-colors";

  return (
    <main className="px-5 pt-6 pb-16">
      <p className="eyebrow mb-1">Haven Paws Admin</p>
      <h1 className="font-display text-xl text-forest mb-1">{breeder.name}</h1>
      <p className="text-sm text-sage mb-4">
        Public page:{" "}
        <Link href={`/breeders/${breeder.slug}`} className="underline text-forest">
          /breeders/{breeder.slug}
        </Link>
      </p>

      {/* Jump links — everything below is on this one page now */}
      <div className="flex flex-wrap gap-2 mb-8">
        <a href="#basics" className={sectionLinkClass}>Basics</a>
        <a href="#home-gallery" className={sectionLinkClass}>Home Gallery</a>
        <a href="#qa" className={sectionLinkClass}>Q&amp;A</a>
        <a href="#photos" className={sectionLinkClass}>Photo Strip</a>
        <a href="#included-items" className={sectionLinkClass}>What&apos;s Included</a>
        <a href="#more-about" className={sectionLinkClass}>More About</a>
        <a href="#qualifications" className={sectionLinkClass}>Qualifications</a>
        <a href="#health-testing" className={sectionLinkClass}>Parent Health Testing</a>
      </div>

      {/* ============================================================= */}
      {/* BASICS                                                         */}
      {/* ============================================================= */}

      <section id="basics" className="scroll-mt-6 mb-12">
        <h2 className="font-display text-lg text-forest mb-3">Basics</h2>

        <BreederForm
          breeder={{ ...breeder, breedId: rawBreeder?.breed_id ?? null }}
          breeds={breeds ?? []}
        />
      </section>

      {/* ============================================================= */}
      {/* HOME GALLERY                                                   */}
      {/* ============================================================= */}

      <section id="home-gallery" className="scroll-mt-6 mb-12 pt-6 border-t border-sage/15">
        <h2 className="font-display text-lg text-forest mb-3">
          Home Gallery Photos ({homePhotos.length}/6)
        </h2>

        {homePhotos.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between bg-white border border-sage/20 rounded-lg p-3 mb-2"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.imageUrl} alt="" className="w-16 h-16 rounded-lg object-cover" />
            <DeleteGenericButton id={p.id} onDelete={removeHomePhoto} />
          </div>
        ))}

        {homePhotos.length < 6 && (
          <SimpleImageUploadForm onUpload={uploadHomePhoto} label="Upload Home Photo" />
        )}
      </section>

      {/* ============================================================= */}
      {/* SECTION 2 — Q&A                                                */}
      {/* ============================================================= */}

      <section id="qa" className="scroll-mt-6 mb-12 pt-6 border-t border-sage/15">
        <h2 className="font-display text-lg text-forest mb-4">
          Q. &amp; A. with {breederName}
        </h2>

        <form action={handleAddQA} className="bg-white border border-sage/20 rounded-lg p-4 mb-6">
          <label className="block text-sm text-ink/80 mb-1">Question</label>
          <input name="question" required className="w-full border border-sage/30 rounded-md px-3 py-2 mb-3" />
          <label className="block text-sm text-ink/80 mb-1">Answer</label>
          <textarea name="answer" required rows={3} className="w-full border border-sage/30 rounded-md px-3 py-2 mb-4" />
          <button type="submit" className="w-full bg-forest text-cream py-2.5 rounded-full hover:bg-forest-light">
            Add Q&amp;A
          </button>
        </form>

        {(qaItems ?? []).map((item) => (
          <div key={item.id} className="flex justify-between items-start bg-white border border-sage/20 rounded-lg p-4 mb-3">
            <div>
              <p className="text-forest font-medium">{item.question}</p>
              <p className="text-sm text-ink/70">{item.answer}</p>
            </div>
            <DeleteGenericButton id={item.id} onDelete={removeQA} />
          </div>
        ))}
      </section>

      {/* ============================================================= */}
      {/* SECTION 3 — PHOTO STRIP                                        */}
      {/* ============================================================= */}

      <section id="photos" className="scroll-mt-6 mb-12 pt-6 border-t border-sage/15">
        <h2 className="font-display text-lg text-forest mb-1">{breederName}&apos;s Photos</h2>
        <p className="text-sm text-sage mb-4">Unbounded — add as many as you like.</p>

        <SimpleImageUploadForm onUpload={uploadPhoto} label="Upload Photo" />

        <div className="grid grid-cols-3 gap-2 mt-6">
          {(photos ?? []).map((p) => (
            <div key={p.id} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.image_url} alt="" className="w-full aspect-square object-cover rounded-lg" />
              <div className="mt-1">
                <DeleteGenericButton id={p.id} onDelete={removePhoto} />
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* ============================================================= */}
      {/* SECTION 8 — MORE ABOUT                                         */}
      {/* ============================================================= */}

      <section id="more-about" className="scroll-mt-6 mb-12 pt-6 border-t border-sage/15">
        <h2 className="font-display text-lg text-forest mb-4">More About {breederName}</h2>

        <form action={handleAddMoreAbout} className="bg-white border border-sage/20 rounded-lg p-4 mb-6">
          <label className="block text-sm text-ink/80 mb-1">Icon</label>
          <select name="icon_key" required className="w-full border border-sage/30 rounded-md px-3 py-2 mb-3">
            {ICON_OPTIONS.map((o) => (
              <option key={o.key} value={o.key}>{o.label}</option>
            ))}
          </select>
          <label className="block text-sm text-ink/80 mb-1">Heading</label>
          <input name="heading" required className="w-full border border-sage/30 rounded-md px-3 py-2 mb-3" />
          <label className="block text-sm text-ink/80 mb-1">Body</label>
          <textarea name="body" required rows={3} className="w-full border border-sage/30 rounded-md px-3 py-2 mb-4" />
          <button type="submit" className="w-full bg-forest text-cream py-2.5 rounded-full hover:bg-forest-light">
            Add Entry
          </button>
        </form>

        {(moreAboutItems ?? []).map((item) => (
          <div key={item.id} className="flex justify-between items-start bg-white border border-sage/20 rounded-lg p-4 mb-3">
            <div>
              <p className="text-forest font-medium">{item.heading}</p>
              <p className="text-sm text-ink/70">{item.body}</p>
            </div>
            <DeleteGenericButton id={item.id} onDelete={removeMoreAbout} />
          </div>
        ))}
      </section>

      {/* ============================================================= */}
      {/* SECTION 9 — QUALIFICATIONS                                     */}
      {/* ============================================================= */}

      <section id="qualifications" className="scroll-mt-6 mb-12 pt-6 border-t border-sage/15">
        <h2 className="font-display text-lg text-forest mb-1">Breeder Qualifications</h2>
        <p className="text-sm text-sage mb-6">{qualificationCount}/8 slots used</p>

        {qualificationCount < 8 ? (
          <QualificationForm breederId={breederId} breederSlug={breederSlug} />
        ) : (
          <p className="text-sm text-sage mb-6">Maximum of 8 reached — delete one to add another.</p>
        )}

        <div className="grid grid-cols-2 gap-3">
          {(qualifications ?? []).map((item) => (
            <div key={item.id} className="bg-white border border-sage/20 rounded-lg p-3">
              {item.badge_image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.badge_image_url} alt="" className="w-12 h-12 rounded-lg object-cover mb-2" />
              )}
              <p className="text-xs text-sage">{item.label_line}</p>
              <p className="text-sm text-forest font-medium">{item.title_line}</p>
              <div className="mt-2">
                <DeleteGenericButton id={item.id} onDelete={removeQualification} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================= */}
      {/* SECTIONS 10–11 — PARENT HEALTH TESTING                         */}
      {/* ============================================================= */}

      <section id="health-testing" className="scroll-mt-6 pt-6 border-t border-sage/15">
        <h2 className="font-display text-lg text-forest mb-4">
          Parent Health Testing — {breederName}
        </h2>

        <form action={handleAddHealthTesting} className="bg-white border border-sage/20 rounded-lg p-4 mb-6">
          <label className="block text-sm text-ink/80 mb-1">Icon</label>
          <select name="icon_key" required className="w-full border border-sage/30 rounded-md px-3 py-2 mb-3">
            {ICON_OPTIONS.map((o) => (
              <option key={o.key} value={o.key}>{o.label}</option>
            ))}
          </select>
          <label className="block text-sm text-ink/80 mb-1">Heading</label>
          <input name="heading" required className="w-full border border-sage/30 rounded-md px-3 py-2 mb-3" />
          <label className="block text-sm text-ink/80 mb-1">Body</label>
          <textarea name="body" required rows={3} className="w-full border border-sage/30 rounded-md px-3 py-2 mb-4" />
          <button type="submit" className="w-full bg-forest text-cream py-2.5 rounded-full hover:bg-forest-light">
            Add Entry
          </button>
        </form>

        {(healthTestingItems ?? []).map((item) => (
          <div key={item.id} className="flex justify-between items-start bg-white border border-sage/20 rounded-lg p-4 mb-3">
            <div>
              <p className="text-forest font-medium">{item.heading}</p>
              <p className="text-sm text-ink/70">{item.body}</p>
            </div>
            <DeleteGenericButton id={item.id} onDelete={removeHealthTesting} />
          </div>
        ))}
      </section>
    </main>
  );
}
