import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import TrainingCard from "../../components/TrainingCard";

export default function HealthWellnessFullPage() {
  return (
    <main>
      <Navbar />
      <section className="max-w-2xl mx-auto px-6 py-10">
        <p className="eyebrow mb-2">Courses</p>
        <h1 className="font-display text-2xl text-forest mb-8">Puppy Health and Wellness</h1>

        <div className="grid grid-cols-2 gap-3">
          {["Vaccinations", "Feeding", "Activity", "Spay/Neuter"].map((title, i) => (
            <TrainingCard key={title} title={title} number={i + 1} color="lavender" />
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}