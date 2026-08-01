import PersonCard from "./PersonCard";
import type { TeamMember } from "../data/teamMembers";

export default function TeamSection({
  title,
  people,
  extraImages,
}: {
  title: string;
  people: TeamMember[];
  extraImages: Record<string, string>;
}) {
  return (
    <section className="max-w-2xl mx-auto px-6 py-14">
      <h2 className="font-display text-2xl text-forest text-center mb-10">{title}</h2>
      {people.map((p) => (
        <PersonCard key={p.slug} person={p} photoUrl={extraImages[`person_${p.slug}`] ?? null} />
      ))}
    </section>
  );
}