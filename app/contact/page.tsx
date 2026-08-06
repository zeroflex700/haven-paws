import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageContainer from "../components/PageContainer";
import BreederApplicationForm from "../components/BreederApplicationForm";
import { getSettings } from "@/lib/queries/settings";

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <main>
      <Navbar />

      <section className="bg-cream-alt py-10">
        <PageContainer className="max-w-2xl text-center">
          <h1 className="h1 mb-2">Contact Us</h1>
          <p className="small-text">We&apos;re here to help.</p>
        </PageContainer>
      </section>

      <PageContainer className="max-w-2xl py-10">
        <h2 className="h2 mb-3">Get in Touch with the Haven Paws Team</h2>
        <p className="body-text">
          At Haven Paws, we&apos;re committed to making every step of your puppy journey
          simple, enjoyable, and worry-free. Whether you&apos;re searching for a puppy,
          already welcomed one into your family, or interested in becoming one of our
          breeders, our team is ready to assist.
        </p>
      </PageContainer>

      <section className="bg-cream-alt py-8">
        <PageContainer className="max-w-2xl">
          <h3 className="h3 mb-2">Future Puppy Owners</h3>
          <p className="body-text mb-3">
            Searching for the right puppy? Our Haven Paws Puppy Advisors are here to help you
            choose the perfect companion based on your lifestyle, preferences, and family
            needs.
          </p>
          {settings.supportPhone && (
            <p className="text-forest font-medium text-sm mb-1">
              Call Us:{" "}
              <a href={`tel:${settings.supportPhone}`} className="underline">
                {settings.supportPhone}
              </a>
            </p>
          )}
          <p className="small-text">Support Hours</p>
          <p className="small-text whitespace-pre-line">{settings.supportHours}</p>
        </PageContainer>
      </section>

      <section className="py-8">
        <PageContainer className="max-w-2xl">
          <h3 className="h3 mb-2">Current Puppy Families</h3>
          <p className="body-text mb-3">
            Already adopted your puppy through Haven Paws? Our support team is always
            available to answer your questions, provide guidance, and help with anything
            related to your puppy after adoption.
          </p>
          <p className="body-text mb-3">
            Visit our Help Center anytime to find answers, resources, and contact options.
          </p>
          <Link
            href="/help-center"
            className="inline-block border border-forest/30 text-forest text-sm px-5 py-2.5 rounded-full hover:border-forest transition-colors"
          >
            Visit Help Center
          </Link>
        </PageContainer>
      </section>

      <section id="breeder-application" className="bg-cream-alt py-8 scroll-mt-20">
        <PageContainer className="max-w-2xl">
          <h3 className="h3 mb-2">Future Breeders</h3>
          <p className="body-text mb-2">
            Interested in partnering with Haven Paws? Our Breeder Relations team is dedicated
            to helping responsible breeders through every stage of the application process.
            We carefully review each application to ensure our standards for health, ethics,
            and animal welfare are maintained.
          </p>
          <p className="body-text mb-5">
            To get started, complete our breeder application form below, or contact us by
            email at{" "}
            <a href={`mailto:${settings.breederEmail}`} className="underline text-forest">
              {settings.breederEmail}
            </a>
            .
          </p>
          <p className="small-text mb-1">Office Hours</p>
          <p className="small-text whitespace-pre-line mb-5">{settings.breederHours}</p>

          <BreederApplicationForm />
        </PageContainer>
      </section>

      <section className="py-8">
        <PageContainer className="max-w-2xl">
          <h3 className="h3 mb-2">Current Breeders</h3>
          <p className="body-text mb-3">
            Already part of the Haven Paws breeder network? Our Breeder Success team is
            available to assist with program updates, account support, compliance questions,
            and any other assistance you may need. We&apos;re committed to supporting our
            breeder partners every step of the way.
          </p>
          <p className="body-text">
            Email us anytime at{" "}
            <a href={`mailto:${settings.breederEmail}`} className="underline text-forest">
              {settings.breederEmail}
            </a>
            .
          </p>
        </PageContainer>
      </section>

      <section className="bg-cream-alt py-10 text-center">
        <PageContainer className="max-w-lg">
          <h3 className="h3 mb-2">Continue Your Puppy Search</h3>
          <p className="body-text mb-5">
            Still looking for your perfect companion? Browse our available puppies and
            discover healthy, responsibly raised companions from trusted Haven Paws breeders.
          </p>
          <Link
            href="/puppies"
            className="inline-block bg-forest text-cream text-sm px-5 py-2.5 rounded-full hover:bg-forest-light transition-colors"
          >
            Browse All Puppies
          </Link>
        </PageContainer>
      </section>

      <Footer />
    </main>
  );
}