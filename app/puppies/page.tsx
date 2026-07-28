
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PuppiesClient from "../components/PuppiesClient";
import { getPuppies } from "@/lib/queries/puppies";

export const dynamic = "force-dynamic";

export default async function PuppiesPage() {
  const puppies = await getPuppies();

  return (
    <main>
      <Navbar />
      <PuppiesClient initialPuppies={puppies} />
      <Footer />
    </main>
  );
}