import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PuppiesClient from "../components/PuppiesClient";
import TrendingSearches from "../components/TrendingSearches";
import FavoriteBreedsRow from "../components/FavoriteBreedsRow";
import RecentSearchesRow from "../components/RecentSearchesRow";
import { getPuppies } from "@/lib/queries/puppies";

export const metadata: Metadata = {
  title: "Available Puppies",
  description:
    "Browse available puppies from vetted, responsible breeders across the U.S.",
  alternates: {
    canonical: "/puppies",
  },
};

export default async function PuppiesPage() {
  const puppies = await getPuppies();

  return (
    <main className="min-h-screen">
      <Navbar />

      <FavoriteBreedsRow />
      <TrendingSearches />
      <RecentSearchesRow />

      <PuppiesClient initialPuppies={puppies} />

      <Footer />
    </main>
  );
}