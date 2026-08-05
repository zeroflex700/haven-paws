import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import TrainingCard from "../../components/TrainingCard";

export default function FirstWeekFullPage() {
  return (
    <main>
      <Navbar />
      <section className="max-w-2xl mx-auto px-6 py-10">
        <p className="eyebrow mb-2">Your First Week</p>
        <h1 className="font-display text-2xl text-forest mb-8">Your First Week</h1>

        <h2 className="font-display text-lg text-forest mb-3">Before Your Puppy Comes Home</h2>
        <div className="grid grid-cols-2 gap-3 mb-10">
          <TrainingCard title="Prepare" description="Getting your home ready" color="green" />
          <TrainingCard title="Gear" description="Essentials to have on hand" color="green" />
        </div>

        <h2 className="font-display text-lg text-forest mb-3">Your Puppy&apos;s First Week</h2>
        <div className="grid grid-cols-2 gap-3 mb-10">
          <TrainingCard title="First Day" description="What to expect" color="green" />
          <TrainingCard title="First Week" description="Settling in together" color="green" />
        </div>

        <div className="bg-cream-alt rounded-lg p-6 text-center">
          <p className="text-forest font-medium">Explore Puppy Training Courses</p>
        </div>
      </section>
      <Footer />
    </main>
  );
}