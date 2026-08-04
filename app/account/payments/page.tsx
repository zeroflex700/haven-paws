import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function PaymentsPage() {
  return (
    <main>
      <Navbar />
      <section className="max-w-2xl mx-auto px-6 py-16">
        <p className="eyebrow mb-3">Your Account</p>
        <h1 className="font-display text-2xl text-forest mb-4">Payments</h1>
        <p className="text-ink/70">Content coming soon.</p>
      </section>
      <Footer />
    </main>
  );
}