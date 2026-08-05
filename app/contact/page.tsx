import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BreederApplicationForm from "../components/BreederApplicationForm";
import { getSettings } from "@/lib/queries/settings";

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <main>
      <Navbar />

      <section className="bg-cream-alt py-14">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h1 className="font-display text-2xl text-forest mb-3">Contact Us</h1>
          <p className="text-ink/70">We&apos;re here to help.</p>
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-6 py-14">
        <h2 className="font-display text-2xl text-forest mb-3">
          Get in Touch with the Haven Paws Team
        </h2>
        <p className="text-ink/80 leading-relaxed">
          At Haven Paws, we&apos;re committed to making every step of your puppy journey
          simple, enjoyable, and worry-free. Whether you&apos;re searching for a puppy,
          already welcomed one into your family, or interested in becoming one of our
          breeders, our team is ready to assist.
        </p>
      </section>

      <section className="bg-cream-alt py-10">
        <div className="max-w-2xl mx-auto px-6">
          <h3 className="font-display text-xl text-forest mb-2">Future Puppy Owners</h3>
          <p className="text-ink/80 leading-relaxed mb-4">
            Searching for the right puppy? Our Haven Paws Puppy Advisors are here to help you
            choose the perfect companion based on your lifestyle, preferences, and family
            needs.
          </p>
          {settings.supportPhone && (
            <p className="text-forest font-medium mb-1">
              Call Us:{" "}
              <a href={`tel:${settings.supportPhone}`} className="underline">
                {settings.supportPhone}
              </a>
            </p>
          )}
          <p className="text-sm text-ink/70">Support Hours</p>
          <p className="text-sm text-ink/70 whitespace-pre-line">
            {settings.supportHours}
          </p>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-2xl mx-auto px-6">
          <h3 className="font-display text-xl text-forest mb-2">Current Puppy Families</h3>
          <p className="text-ink/80 leading-relaxed mb-4">
            Already adopted your puppy through Haven Paws? Our support team is always
            available to answer your questions, provide guidance, and help with anything
            related to your puppy after adoption.
          </p>
          <p className="text-ink/80 leading-relaxed mb-4">
            Visit our Help Center anytime to find answers, resources, and contact options.
          </p>
          <Link
            href="/help-center"
            className="inline-block border border-forest/30 text-forest px-6 py-2.5 rounded-full hover:border-forest transition-colors"
          >
            Visit Help Center
          </Link>
        </div>
      </section>

      <section id="breeder-application" className="bg-cream-alt py-10 scroll-mt-20">
        <div className="max-w-2xl mx-auto px-6">
          <h3 className="font-display text-xl text-forest mb-2">Future Breeders</h3>
          <p className="text-ink/80 leading-relaxed mb-2">
            Interested in partnering with Haven Paws? Our Breeder Relations team is dedicated
            to helping responsible breeders through every stage of the application process.
            We carefully review each application to ensure our standards for health, ethics,
            and animal welfare are maintained.
          </p>
          <p className="text-ink/80 leading-relaxed mb-6">
            To get started, complete our breeder application form below, or contact us by
            email at{" "}
            <a href={`mailto:${settings.breederEmail}`} className="underline text-forest">
              {settings.breederEmail}
            </a>
            .
          </p>
          <p className="text-sm text-ink/70 mb-1">Office Hours</p>
          <p className="text-sm text-ink/70 whitespace-pre-line mb-6">
            {settings.breederHours}
          </p>

          <BreederApplicationForm />
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-2xl mx-auto px-6">
          <h3 className="font-display text-xl text-forest mb-2">Current Breeders</h3>
          <p className="text-ink/80 leading-relaxed mb-4">
            Already part of the Haven Paws breeder network? Our Breeder Success team is
            available to assist with program updates, account support, compliance questions,
            and any other assistance you may need. We&apos;re committed to supporting our
            breeder partners every step of the way.
          </p>
          <p className="text-ink/80 leading-relaxed">
            Email us anytime at{" "}
            <a href={`mailto:${settings.breederEmail}`} className="underline text-forest">
              {settings.breederEmail}
            </a>
            .
          </p>
        </div>
      </section>

      <section className="bg-cream-alt py-14 text-center">
        <div className="max-w-lg mx-auto px-6">
          <h3 className="font-display text-xl text-forest mb-2">
            Continue Your Puppy Search
          </h3>
          <p className="text-ink/80 leading-relaxed mb-6">
            Still looking for your perfect companion? Browse our available puppies and
            discover healthy, responsibly raised companions from trusted Haven Paws breeders.
          </p>
          <Link
            href="/puppies"
            className="inline-block bg-forest text-cream px-6 py-2.5 rounded-full hover:bg-forest-light transition-colors"
          >
            Browse All Puppies
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}