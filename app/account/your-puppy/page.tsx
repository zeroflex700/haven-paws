import { Suspense } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PageContainer from "../../components/PageContainer";
import YourPuppyClient from "./YourPuppyClient";

export default function YourPuppyPage() {
  return (
    <main>
      <Navbar />
      <PageContainer className="max-w-2xl py-10">
        <p className="eyebrow mb-2">Your Account</p>
        <h1 className="h1 mb-8">Your Puppy</h1>
        <Suspense fallback={null}>
          <YourPuppyClient />
        </Suspense>
      </PageContainer>
      <Footer />
    </main>
  );
}