import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageContainer from "../components/PageContainer";
import TrainingCard from "../components/TrainingCard";
import { ProtectedImage } from "../components/ProtectedMedia";
import { getPageImages } from "@/lib/queries/pageContent";
import { GraduationCap, Phone, Users2 } from "lucide-react";

export default async function PuppyTrainingLandingPage() {
  const { heroImage, extraImages, extraText } = await getPageImages("puppy-training");

  return (
    <main>
      <Navbar />

      <PageContainer className="max-w-2xl pt-8 pb-5 flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">Puppy Training Program</p>
          <h1 className="h1 mb-3">Everything you need to become a confident puppy owner</h1>
          <p className="body-text">
            Guided lessons, live coaching, and a community that grows with your puppy.
          </p>
        </div>
        <Link
          href="/puppy-training/hub"
          className="shrink-0 bg-forest text-cream text-sm px-4 py-2 rounded-full hover:bg-forest-light transition-colors"
        >
          Get Started
        </Link>
      </PageContainer>

      {heroImage && (
        <PageContainer className="max-w-2xl mb-8">
          <div className="aspect-video rounded-lg overflow-hidden">
            <ProtectedImage src={heroImage} alt="Puppy Training" />
          </div>
        </PageContainer>
      )}

      <PageContainer className="max-w-2xl pb-8">
        <h2 className="h2 mb-2">Build a lasting bond in just a few weeks</h2>
        {extraText.landing_description && <p className="body-text">{extraText.landing_description}</p>}
      </PageContainer>

      <PageContainer className="max-w-2xl pb-10">
        <h3 className="h3 mb-4">What you get with the program</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-cream-alt rounded-lg p-4 text-center">
            <GraduationCap size={18} className="text-gold mx-auto mb-2" strokeWidth={1.5} />
            <p className="text-xs text-ink/80">Online Self-Paced Classes</p>
          </div>
          <div className="bg-cream-alt rounded-lg p-4 text-center">
            <Phone size={18} className="text-gold mx-auto mb-2" strokeWidth={1.5} />
            <p className="text-xs text-ink/80">Weekly Coaching Calls</p>
          </div>
          <div className="bg-cream-alt rounded-lg p-4 text-center">
            <Users2 size={18} className="text-gold mx-auto mb-2" strokeWidth={1.5} />
            <p className="text-xs text-ink/80">Private Community Group</p>
          </div>
        </div>
      </PageContainer>

      <section className="bg-forest py-10 text-center">
        <PageContainer className="max-w-lg">
          <p className="eyebrow text-cream/70 mb-2">Owners Trust Our Program</p>
          <p className="text-cream text-base italic mb-2">
            &quot;This program made the first weeks with our puppy so much easier.&quot;
          </p>
          <p className="text-cream/60 text-xs">A Haven Paws puppy parent</p>
        </PageContainer>
      </section>

      <PageContainer className="max-w-2xl py-10">
        <h3 className="h3 mb-5 text-center">Popular courses</h3>
        <div className="grid grid-cols-3 gap-3 mb-5">
          <TrainingCard title="House Training" color="green" />
          <TrainingCard title="Manners" color="pink" />
          <TrainingCard title="Socialization" color="yellow" />
        </div>
        <div className="text-center">
          <Link href="/puppy-training/hub" className="text-sm text-forest border-b border-gold pb-0.5">
            Explore the Puppy Training Program
          </Link>
        </div>
      </PageContainer>

      <section className="bg-cream-alt py-10">
        <PageContainer className="max-w-2xl grid sm:grid-cols-2 gap-5 items-center">
          <div>
            <h3 className="h3 mb-2">Set your dog up for success</h3>
            {extraText.success_description && <p className="body-text">{extraText.success_description}</p>}
          </div>
          {extraImages.success_illustration && (
            <div className="aspect-square rounded-lg overflow-hidden">
              <ProtectedImage src={extraImages.success_illustration} alt="Success" />
            </div>
          )}
        </PageContainer>
      </section>

      <Footer />
    </main>
  );
}