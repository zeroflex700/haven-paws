import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TeamSection from "../components/TeamSection";
import { getPageImages } from "@/lib/queries/pageContent";
import { cldOptimized } from "@/lib/cloudinary";
import { LEADERSHIP, DIRECTORS, TEAM } from "../data/teamMembers";

export default async function AboutPage() {
  const { heroImage, heroVideo, extraImages } = await getPageImages("about");

  return (
    <main>
      <Navbar />

      <section className="max-w-2xl mx-auto px-6 py-14">
        <p className="eyebrow mb-3">About Haven Paws</p>
        <h1 className="font-display text-2xl text-forest mb-6">Our Story</h1>

        {heroImage && (
          <div className="aspect-[4/3] rounded-lg overflow-hidden mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cldOptimized(heroImage, 800)}
              alt="Our Story"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <p className="text-ink/80 leading-relaxed mb-4">
          At Haven Paws, we&apos;re passionate about bringing loving families together with
          healthy, well-raised puppies from carefully screened breeders across the country.
          Our goal is to make the adoption journey safe, transparent, and enjoyable while
          supporting ethical breeding practices and lifelong responsible pet ownership.
        </p>
        <p className="text-ink/80 leading-relaxed mb-4">
          Every puppy deserves a nurturing start, every breeder deserves a trusted partner,
          and every family deserves the confidence that comes from choosing a puppy with
          care. That&apos;s the philosophy behind everything we do.
        </p>
        <p className="text-ink/80 leading-relaxed">
          We&apos;ve helped many families welcome a new best friend into their homes. Every
          successful match represents more than a transaction — it&apos;s the beginning of a
          lifelong bond filled with companionship, loyalty, and unforgettable memories.
        </p>
      </section>

      <section className="max-w-2xl mx-auto px-6 py-14">
        <h2 className="font-display text-2xl text-forest mb-4">Our Mission</h2>
        <p className="text-ink/80 leading-relaxed">
          Our mission is simple: connect exceptional puppies with exceptional families while
          maintaining the highest standards of animal welfare, breeder accountability, and
          customer care. From the moment a breeder joins our network until a puppy settles
          into its forever home, we focus on health, transparency, and personalized support
          every step of the way.
        </p>
      </section>

      {extraImages.years_in_business && (
        <section className="bg-cream-alt">
          <div className="max-w-2xl mx-auto px-6 py-14">
            <div className="aspect-video rounded-lg overflow-hidden mb-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cldOptimized(extraImages.years_in_business, 800)}
                alt="Since 2018"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="font-display text-2xl text-forest text-center">
              We&apos;ve been connecting families with healthy puppies since 2018.
            </h2>
          </div>
        </section>
      )}

      {heroVideo && (
        <section className="max-w-2xl mx-auto px-6 py-14">
          <h2 className="font-display text-2xl text-forest text-center mb-6">
            Real Life-Changing Experiences
          </h2>
          <video src={heroVideo} controls className="w-full rounded-lg" />
        </section>
      )}

      <TeamSection title="Leadership" people={LEADERSHIP} extraImages={extraImages} />
      <div className="bg-cream-alt">
        <TeamSection title="Directors" people={DIRECTORS} extraImages={extraImages} />
      </div>
      <TeamSection title="Our Team" people={TEAM} extraImages={extraImages} />

      <section className="bg-cream-alt py-14">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="font-display text-2xl text-forest mb-4">About Haven Paws</h2>
          <p className="text-ink/80 leading-relaxed mb-4">
            Founded in 2018, Haven Paws has grown into one of America&apos;s trusted online
            puppy adoption platforms. Our mission is to connect responsible breeders with
            caring families while maintaining exceptional standards of health, transparency,
            and customer support throughout every step of the journey.
          </p>
          <p className="text-ink/80 leading-relaxed mb-4">
            Over the years, we&apos;ve helped thousands of families welcome happy, healthy
            puppies into loving homes. By combining modern technology with personalized
            guidance, we&apos;ve made the puppy adoption process safer, simpler, and more
            enjoyable for everyone involved.
          </p>
          <p className="text-ink/80 leading-relaxed mb-4">
            Every breeder accepted into the Haven Paws network goes through a careful
            screening process designed to promote responsible breeding practices and protect
            puppy welfare. We partner only with breeders who share our commitment to ethical
            care, proper socialization, and healthy development.
          </p>
          <p className="text-ink/80 leading-relaxed mb-4">
            Our experienced Puppy Advisors remain available throughout the adoption process,
            helping families choose the right breed, prepare for their new companion, and
            feel supported even after their puppy arrives home.
          </p>
          <p className="text-ink/80 leading-relaxed mb-4">
            We also believe education is an important part of responsible pet ownership.
            That&apos;s why Haven Paws provides helpful resources covering puppy care,
            nutrition, training, socialization, and long-term wellness so every family can
            feel confident from day one.
          </p>
          <p className="text-ink/80 leading-relaxed">
            At Haven Paws, we&apos;re more than a puppy marketplace — we&apos;re a community
            of passionate dog lovers dedicated to building lifelong connections between
            families and their newest four-legged companions. Every successful adoption
            represents the beginning of a friendship built on trust, loyalty, and
            unconditional love.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}