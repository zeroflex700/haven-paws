import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PageContainer from "../../components/PageContainer";
import Breadcrumbs from "../../components/Breadcrumbs";
import TrainingCard from "../../components/TrainingCard";

export default function FirstWeekFullPage() {
  return (
    <main>
      <Navbar />
      <PageContainer className="max-w-2xl py-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Puppy Training", href: "/puppy-training/hub" },
            { label: "Your First Week" },
          ]}
        />
        <p className="eyebrow mb-2">Your First Week</p>
        <h1 className="h1 mb-8">Your First Week</h1>

        <h2 className="h3 mb-3">Before Your Puppy Comes Home</h2>
        <div className="grid grid-cols-2 gap-3 mb-10">
          <TrainingCard title="Prepare" description="Getting your home ready" color="green" />
          <TrainingCard title="Gear" description="Essentials to have on hand" color="green" />
        </div>

        <h2 className="h3 mb-3">Your Puppy&apos;s First Week</h2>
        <div className="grid grid-cols-2 gap-3 mb-10">
          <TrainingCard title="First Day" description="What to expect" color="green" />
          <TrainingCard title="First Week" description="Settling in together" color="green" />
        </div>

        <div className="bg-cream-alt rounded-lg p-6 text-center">
          <p className="text-forest font-medium text-sm">Explore Puppy Training Courses</p>
        </div>
      </PageContainer>
      <Footer />
    </main>
  );
}