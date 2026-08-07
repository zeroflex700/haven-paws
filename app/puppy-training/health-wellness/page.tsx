import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PageContainer from "../../components/PageContainer";
import Breadcrumbs from "../../components/Breadcrumbs";
import TrainingCard from "../../components/TrainingCard";

export default function HealthWellnessFullPage() {
  return (
    <main>
      <Navbar />
      <PageContainer className="max-w-2xl py-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Puppy Training", href: "/puppy-training/hub" },
            { label: "Health & Wellness" },
          ]}
        />
        <p className="eyebrow mb-2">Courses</p>
        <h1 className="h1 mb-8">Puppy Health and Wellness</h1>

        <div className="grid grid-cols-2 gap-3">
          {["Vaccinations", "Feeding", "Activity", "Spay/Neuter"].map((title, i) => (
            <TrainingCard key={title} title={title} number={i + 1} color="lavender" />
          ))}
        </div>
      </PageContainer>
      <Footer />
    </main>
  );
}