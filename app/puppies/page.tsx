import { Suspense } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PuppiesClient from "../components/PuppiesClient";
import { getPuppies } from "@/lib/queries/puppies";

export default async function PuppiesPage() {
  const puppies = await getPuppies();

  return (
    <main>
      <Navbar />
      <Suspense fallback={null}>
        <PuppiesClient initialPuppies={puppies} />
      </Suspense>
      <Footer />
    </main>
  );
}