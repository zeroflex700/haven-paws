import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DeliveryInfo from "../components/DeliveryInfo";

export default function DeliveryPage() {
  return (
    <main className="pt-8">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 pt-8">
        <p className="eyebrow mb-3">Delivery &amp; Care</p>
        <h1 className="font-display text-3xl text-forest mb-6">
          Bringing your puppy home
        </h1>
      </div>
      <DeliveryInfo />
      <Footer />
    </main>
  );
}