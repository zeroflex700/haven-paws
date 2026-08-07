import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PageContainer from "../../components/PageContainer";
import TrainingCard from "../../components/TrainingCard";
import SectionTabs from "../../components/SectionTabs";

const TABS = [
  { id: "get-coaching", label: "Get Coaching" },
  { id: "first-week", label: "Your First Week" },
  { id: "courses", label: "Courses" },
  { id: "training-guides", label: "Training Guides" },
];

export default function PuppyTrainingHubPage() {
  return (
    <main>
      <Navbar />
      <SectionTabs sections={TABS} />

      <PageContainer className="max-w-2xl py-8">
        <div id="get-coaching" className="grid grid-cols-3 gap-3 mb-10 scroll-mt-28">
          <TrainingCard title="Welcome" byline="Puppy Training Team" color="green" />
          <div className="bg-cream-alt rounded-lg p-4">
            <p className="font-medium text-forest text-sm mb-1">Coaching Calls</p>
            <p className="text-xs text-ink/70">Next call: this week</p>
            <button className="mt-2 text-xs text-forest border-b border-gold pb-0.5">RSVP</button>
          </div>
          <div className="bg-cream-alt rounded-lg p-4">
            <p className="font-medium text-forest text-sm mb-1">Private Community</p>
            <p className="text-xs text-ink/70">Connect with other owners</p>
          </div>
        </div>

        <h2 className="h2 mb-2">What Is the Puppy Training Program?</h2>
        <p className="body-text mb-10">
          A structured, self-paced program with live coaching and community support to help
          your puppy build good habits from day one.
        </p>

        <div id="first-week" className="scroll-mt-28">
          <div className="flex items-center justify-between mb-4">
            <h3 className="h3">Your First Week</h3>
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
        </div>

        <div id="courses" className="scroll-mt-28">
          <h3 className="h3 mb-4">Courses</h3>
          <div className="grid grid-cols-2 gap-3 mb-10">
            <TrainingCard title="House Training" description="Build good bathroom habits" color="green" />
            <TrainingCard title="Crate Training" description="A calm, safe space" color="orange" />
            <TrainingCard title="Socialization" description="Confident around new things" color="yellow" />
            <TrainingCard title="Manners" description="Everyday good behavior" color="pink" />
          </div>

          <div className="flex items-center justify-between mb-4">
            <h4 className="h3">Get Started With Crate Training</h4>
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
            <h4 className="h3">Get Started With Health &amp; Wellness</h4>
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
        </div>

        <div id="training-guides" className="scroll-mt-28">
          <div className="flex items-center justify-between mb-4">
            <h3 className="h3">Get Our Training Guides</h3>
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
        </div>

        <h3 className="h3 mb-4">Featured Course</h3>
        <TrainingCard
          title="Complete Puppy Foundations"
          description="Everything from house training to socialization, in one guided course."
          color="lavender"
        />
      </PageContainer>

      <Footer />
    </main>
  );
}