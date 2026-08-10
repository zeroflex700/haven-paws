import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import FavoritesClient from "./FavoritesClient";

export default function FavoritesPage() {
  return (
    <main>
      <Navbar />
      <FavoritesClient />
      <Footer />
    </main>
  );
}