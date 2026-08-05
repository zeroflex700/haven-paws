import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TrainingCard from "../components/TrainingCard";
import { ProtectedImage } from "../components/ProtectedMedia";
import { getPageImages } from "@/lib/queries/pageContent";
import { GraduationCap, Phone, Users2 } from "lucide-react";

export default async function PuppyTrainingLandingPage() {
  const { heroImage, extraImages, extraText } = await getPageImages("puppy-training");

  return (
    <main>
      <Navbar />

      <section className="max-w-2xl mx-auto px-6 pt-10 pb-6 flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">Puppy Training Program</p>
          <h1 className="font-display text-2xl text-forest mb-4 leading-tight">
            Everything you need to become a confident puppy owner
          </h1>
          <p className="text-ink/70 mb-4">
            Guided lessons, live coaching, and a community that grows with your puppy.
          </p>
        </div>
        <Link
          href="/puppy-training/hub"
          className="shrink-0 bg-forest text-cream px-5 py-2.5 rounded-full text-sm hover:bg-forest-light transition-colors"
        >
          Get Started
        </Link>
      </section>

      {heroImage && (
        <div className="max-w-2xl mx-auto px-6 mb-10">
          <div className="aspect-video rounded-lg overflow-hidden">
            <ProtectedImage src={heroImage} alt="Puppy Training" />
          </div>
        </div>
      )}

      <section className="max-w-2xl mx-auto px-6 pb-10">
        <h2 className="font-display text-2xl text-forest mb-3">
          Build a lasting bond in just a few weeks
        </h2>
        {extraText.landing_description && (
          <p className="text-ink/80 leading-relaxed">{extraText.landing_description}</p>
        )}
      </section>

      <section className="max-w-2xl mx-auto px-6 pb-14">
        <h3 className="font-display text-xl text-forest mb-6">
          What you get with the program
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-cream-alt rounded-lg p-4 text-center">
            <GraduationCap size={20} className="text-gold mx-auto mb-2" strokeWidth={1.5} />
            <p className="text-xs text-ink/80">Online Self-Paced Classes</p>
          </div>
          <div className="bg-cream-alt rounded-lg p-4 text-center">
            <Phone size={20} className="text-gold mx-auto mb-2" strokeWidth={1.5} />
            <p className="text-xs text-ink/80">Weekly Coaching Calls</p>
          </div>
          <div className="bg-cream-alt rounded-lg p-4 text-center">
            <Users2 size={20} className="text-gold mx-auto mb-2" strokeWidth={1.5} />
            <p className="text-xs text-ink/80">Private Community Group</p>
          </div>
        </div>
      </section>

      <section className="bg-forest py-14 text-center">
        <div className="max-w-lg mx-auto px-6">
          <p className="eyebrow text-cream/70 mb-3">Owners Trust Our Program</p>
          <p className="text-cream text-lg italic mb-3">
            &quot;This program made the first weeks with our puppy so much easier.&quot;
          </p>
          <p className="text-cream/60 text-sm">A Haven Paws puppy parent</p>
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-6 py-14">
        <h3 className="font-display text-xl text-forest mb-6 text-center">Popular courses</h3>
        <div className="grid grid-cols-3 gap-3 mb-6">
          <TrainingCard title="House Training" color="green" />
          <TrainingCard title="Manners" color="pink" />
          <TrainingCard title="Socialization" color="yellow" />
        </div>
        <div className="text-center">
          <Link href="/puppy-training/hub" className="text-forest border-b border-gold pb-0.5">
            Explore the Puppy Training Program
          </Link>
        </div>
      </section>

      <section className="bg-cream-alt py-14">
        <div className="max-w-2xl mx-auto px-6 grid sm:grid-cols-2 gap-6 items-center">
          <div>
            <h3 className="font-display text-xl text-forest mb-3">
              Set your dog up for success
            </h3>
            {extraText.success_description && (
              <p className="text-ink/80 leading-relaxed">{extraText.success_description}</p>
            )}
          </div>
          {extraImages.success_illustration && (
            <div className="aspect-square rounded-lg overflow-hidden">
              <ProtectedImage src={extraImages.success_illustration} alt="Success" />
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}