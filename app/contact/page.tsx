import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ContactPage() {
  return (
    <main>
      <Navbar />
      <section className="max-w-3xl mx-auto px-6 py-16">
        <p className="eyebrow mb-3">Contact Us</p>
        <h1 className="font-display text-3xl text-forest mb-6">
          Get in touch
        </h1>
        <p className="text-ink/80 leading-relaxed mb-6">
          Have a question about a specific puppy? Reach out directly from
          that puppy&apos;s page and we&apos;ll respond as soon as possible. For
          general inquiries, email us below.
        </p>
        <a href="mailto:hello@havenpaws.com" className="text-forest border-b border-gold pb-0.5">
          hello@havenpaws.com
        </a>
      </section>
      <Footer />
    </main>
  );
}