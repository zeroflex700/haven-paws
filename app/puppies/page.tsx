import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PuppiesClient from "../components/PuppiesClient";
import TrendingSearches from "../components/TrendingSearches";
import { getPuppies } from "@/lib/queries/puppies";

export default async function PuppiesPage() {
  const puppies = await getPuppies();

  return (
    <main>
      <Navbar />
      <TrendingSearches />
      <PuppiesClient initialPuppies={puppies} />
      <Footer />
    </main>
  );
}