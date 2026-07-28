import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import TrustBadges from "./components/TrustBadges";
import FeaturedLitter from "./components/FeaturedLitter";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <TrustBadges />
      <FeaturedLitter />
      <HowItWorks />
      <Footer />
    </main>
  );
}