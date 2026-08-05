import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import TrainingCard from "../../components/TrainingCard";

export default function PuppyTrainingHubPage() {
  return (
    <main>
      <Navbar />

      <div className="sticky top-[64px] z-30 bg-cream/95 backdrop-blur border-b border-sage/20">
        <div className="flex gap-6 overflow-x-auto px-6 py-3 max-w-2xl mx-auto text-sm">
          <span className="text-forest font-medium whitespace-nowrap">Your First Week</span>
          <span className="text-ink/60 whitespace-nowrap">Courses</span>
          <span className="text-ink/60 whitespace-nowrap">Training Guides</span>
          <span className="text-ink/60 whitespace-nowrap">Get Coaching</span>
        </div>
      </div>

      <section className="max-w-2xl mx-auto px-6 py-10">
        <div className="grid grid-cols-3 gap-3 mb-10">
          <TrainingCard title="Welcome" byline="Puppy Training Team" color="green" />
          <div className="bg-cream-alt rounded-lg p-4">
            <p className="font-medium text-forest mb-1">Coaching Calls</p>
            <p className="text-xs text-ink/70">Next call: this week</p>
            <button className="mt-2 text-xs text-forest border-b border-gold pb-0.5">RSVP</button>
          </div>
          <div className="bg-cream-alt rounded-lg p-4">
            <p className="font-medium text-forest mb-1">Private Community</p>
            <p className="text-xs text-ink/70">Connect with other owners</p>
          </div>
        </div>

        <h2 className="font-display text-xl text-forest mb-2">
          What Is the Puppy Training Program?
        </h2>
        <p className="text-ink/70 mb-10">
          A structured, self-paced program with live coaching and community support to help
          your puppy build good habits from day one.
        </p>

        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg text-forest">Your First Week</h3>
          <Link href="/puppy-training/first-week" className="text-sm text-forest border-b border-gold pb-0.5">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-10">
          <TrainingCard title="Prepare" description="Getting your home ready" color="green" />
          <TrainingCard title="First Day" description="What to expect" color="green" />
          <TrainingCard title="First Week" description="Settling in together" color="green" />
          <TrainingCard title="Gear" description="Essentials to have on hand" color="green" />
        </div>

        <h3 className="font-display text-lg text-forest mb-4">Courses</h3>
        <div className="grid grid-cols-2 gap-3 mb-10">
          <TrainingCard title="House Training" description="Build good bathroom habits" color="green" />
          <TrainingCard title="Crate Training" description="A calm, safe space" color="orange" />
          <TrainingCard title="Socialization" description="Confident around new things" color="yellow" />
          <TrainingCard title="Manners" description="Everyday good behavior" color="pink" />
        </div>

        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg text-forest">Get Started With Crate Training</h3>
          <Link href="/puppy-training/crate-training" className="text-sm text-forest border-b border-gold pb-0.5">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-10">
          <TrainingCard title="Intro" color="orange" />
          <TrainingCard title="Supplies" color="orange" />
          <TrainingCard title="Love the Crate" color="orange" />
          <TrainingCard title="Stay Quiet" color="orange" />
        </div>

        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg text-forest">Get Started With Health &amp; Wellness</h3>
          <Link href="/puppy-training/health-wellness" className="text-sm text-forest border-b border-gold pb-0.5">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-10">
          <TrainingCard title="Vaccinations" color="lavender" />
          <TrainingCard title="Feeding" color="lavender" />
          <TrainingCard title="Activity" color="lavender" />
          <TrainingCard title="Spay/Neuter" color="lavender" />
        </div>

        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg text-forest">Get Our Training Guides</h3>
          <Link href="/puppy-training/training-guides" className="text-sm text-forest border-b border-gold pb-0.5">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-10">
          <TrainingCard title="First Day Checklist" color="gray" />
          <TrainingCard title="First Week Checklist" color="gray" />
          <TrainingCard title="Family Worksheet" color="gray" />
          <TrainingCard title="Sample Planner" color="gray" />
        </div>

        <h3 className="font-display text-lg text-forest mb-4">Featured Course</h3>
        <TrainingCard
          title="Complete Puppy Foundations"
          description="Everything from house training to socialization, in one guided course."
          color="lavender"
        />
      </section>

      <Footer />
    </main>
  );
}