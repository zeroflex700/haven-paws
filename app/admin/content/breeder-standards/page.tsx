import { getPageImagesAdmin } from "@/lib/queries/pageContent";
import PageHeroVideoUploader from "../../components/PageHeroVideoUploader";
import NamedImageUploader from "../../components/NamedImageUploader";
import NamedVideoUploader from "../../components/NamedVideoUploader";

export default async function AdminBreederStandardsContentPage() {
  const { heroVideo, extraImages, extraVideos } = await getPageImagesAdmin("breeder-standards");

  return (
    <main className="px-5 pt-6 pb-10">
      <p className="eyebrow mb-1">Haven Paws Admin</p>
      <h1 className="font-display text-2xl text-forest mb-2">Breeder Standards Page</h1>
      <p className="text-sm text-sage mb-6">
        Manage advisory board members separately at{" "}
        <a href="/admin/board" className="underline text-forest">/admin/board</a>.
      </p>

      <p className="font-display text-lg text-forest mb-3">Hero Video</p>
      <PageHeroVideoUploader slug="breeder-standards" currentUrl={heroVideo} />

      <p className="font-display text-lg text-forest mb-3 mt-6">Standards Section Images</p>
      <NamedImageUploader
        slug="breeder-standards"
        imageKey="standards_healthy_puppies"
        label="Healthy Puppies"
        currentUrl={extraImages.standards_healthy_puppies ?? null}
      />
      <NamedImageUploader
        slug="breeder-standards"
        imageKey="standards_program_audit"
        label="Breeder Program Audit"
        currentUrl={extraImages.standards_program_audit ?? null}
      />
      <NamedImageUploader
        slug="breeder-standards"
        imageKey="standards_home_audit"
        label="Breeder Home Audit"
        currentUrl={extraImages.standards_home_audit ?? null}
      />
      <NamedImageUploader
        slug="breeder-standards"
        imageKey="standards_breeder_support"
        label="Breeder Support"
        currentUrl={extraImages.standards_breeder_support ?? null}
      />

      <p className="font-display text-lg text-forest mb-3 mt-6">Approval Process Videos</p>
      <NamedVideoUploader
        slug="breeder-standards"
        videoKey="process_step1"
        label="Step 1: Application & Background Verification"
        currentUrl={extraVideos.process_step1 ?? null}
      />
      <NamedVideoUploader
        slug="breeder-standards"
        videoKey="process_step2"
        label="Step 2: Health & Facility Assessment"
        currentUrl={extraVideos.process_step2 ?? null}
      />
      <NamedVideoUploader
        slug="breeder-standards"
        videoKey="process_step3"
        label="Step 3: Breeder Education & Onboarding"
        currentUrl={extraVideos.process_step3 ?? null}
      />
      <NamedVideoUploader
        slug="breeder-standards"
        videoKey="process_step4"
        label="Step 4: Continuous Compliance Monitoring"
        currentUrl={extraVideos.process_step4 ?? null}
      />

      <p className="font-display text-lg text-forest mb-3 mt-6">Advocacy Section</p>
      <NamedVideoUploader
        slug="breeder-standards"
        videoKey="advocacy_video"
        label="Advocacy & Scam Prevention Video"
        currentUrl={extraVideos.advocacy_video ?? null}
      />
    </main>
  );
}