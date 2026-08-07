import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PageContainer from "../../components/PageContainer";
import Breadcrumbs from "../../components/Breadcrumbs";
import TrainingCard from "../../components/TrainingCard";

export default function TrainingGuidesFullPage() {
  return (
    <main>
      <Navbar />
      <PageContainer className="max-w-2xl py-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Puppy Training", href: "/puppy-training/hub" },
            { label: "Training Guides" },
          ]}
        />
        <p className="eyebrow mb-2">Resources</p>
        <h1 className="h1 mb-8">Training Guides</h1>

        <div className="grid grid-cols-2 gap-3 mb-10">
          {["First Day Checklist", "First Week Checklist", "Family Worksheet", "First Month Goals", "Sample Planner"].map(
            (title) => (
              <TrainingCard key={title} title={title} color="gray" />
            )
          )}
        </div>

        <div className="bg-cream-alt rounded-lg p-6 text-center">
          <p className="text-forest font-medium text-sm mb-3">Explore Puppy Training Courses</p>
          <a href="/puppy-training/hub" className="inline-block bg-forest text-cream px-5 py-2 rounded-full text-sm">
            View Courses
          </a>
        </div>
      </PageContainer>
      <Footer />
    </main>
  );
}