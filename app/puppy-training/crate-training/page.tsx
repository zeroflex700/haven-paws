import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PageContainer from "../../components/PageContainer";
import Breadcrumbs from "../../components/Breadcrumbs";
import TrainingCard from "../../components/TrainingCard";

export default function CrateTrainingFullPage() {
  return (
    <main>
      <Navbar />
      <PageContainer className="max-w-2xl py-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Puppy Training", href: "/puppy-training/hub" },
            { label: "Crate Training" },
          ]}
        />
        <p className="eyebrow mb-2">Courses</p>
        <h1 className="h1 mb-8">Crate Training</h1>

        <h2 className="h3 mb-3">Crate Training Basics</h2>
        <div className="grid grid-cols-3 gap-3 mb-10">
          <TrainingCard title="Intro" color="orange" />
          <TrainingCard title="Supplies" color="orange" />
          <TrainingCard title="FAQs" color="orange" />
        </div>

        <h2 className="h3 mb-3">Crate Training Lessons</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            "Love the Crate",
            "Stay Quiet",
            "10 Min",
            "60 Min",
            "Quiet Without",
            "Quiet Anywhere",
            "Transfer Skills",
            "Crate Fear",
          ].map((title, i) => (
            <TrainingCard key={title} title={title} number={i + 1} color="orange" />
          ))}
        </div>
      </PageContainer>
      <Footer />
    </main>
  );
}