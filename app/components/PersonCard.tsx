import { cldOptimized } from "@/lib/cloudinary";
import type { TeamMember } from "../data/teamMembers";

export default function PersonCard({
  person,
  photoUrl,
}: {
  person: TeamMember;
  photoUrl: string | null;
}) {
  return (
    <div className="text-center mb-14">
      <div className="w-40 h-40 rounded-full overflow-hidden bg-cream-alt mx-auto mb-4">
        {photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cldOptimized(photoUrl, 300)}
            alt={person.name}
            className="w-full h-full object-cover"
          />
        ) : null}
      </div>
      <h3 className="font-display text-xl text-forest">{person.name}</h3>
      <p className="text-sm text-sage mb-4">{person.title}</p>
      <p className="text-ink/80 leading-relaxed max-w-lg mx-auto whitespace-pre-line text-left sm:text-center">
        {person.bio}
      </p>
    </div>
  );
}