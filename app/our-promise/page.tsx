import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getSettings } from "@/lib/queries/settings";

export default async function OurPromisePage() {
  const settings = await getSettings();

  return (
    <main>
      <Navbar />
      <section className="max-w-7xl mx-auto px-6 py-16">
        <p className="eyebrow mb-3">About Haven Paws</p>
        <h1 className="font-display text-3xl text-forest mb-4">Our Promise</h1>
        <p className="text-ink/70 leading-relaxed">{settings.promiseText}</p>
      </section>
      <Footer />
    </main>
  );
}