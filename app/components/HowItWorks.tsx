const steps = [
  { n: "01", title: "Browse & Inquire", body: "Explore available puppies and send an inquiry about the one you love." },
  { n: "02", title: "Meet & Reserve", body: "Schedule a video call or in-person visit, then reserve with a deposit." },
  { n: "03", title: "Health Review", body: "Receive full vet records, vaccination history, and health guarantee." },
  { n: "04", title: "Welcome Home", body: "Coordinate pickup or delivery and bring your puppy home." },
];

export default function HowItWorks() {
  return (
    <section className="bg-cream-alt py-20">
      <div className="max-w-6xl mx-auto px-6">
        <p className="eyebrow mb-3">The Process</p>
        <h2 className="font-display text-3xl text-forest mb-12">
          How it works
        </h2>
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((s) => (
            <div key={s.n}>
              <span className="font-display text-2xl text-gold">{s.n}</span>
              <h3 className="text-forest font-medium mt-2 mb-2">{s.title}</h3>
              <p className="text-sm text-ink/70">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}