import OptimizedImage from "./OptimizedImage";
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
      <div className="w-32 h-32 rounded-full overflow-hidden bg-cream-alt mx-auto mb-4">
        <OptimizedImage src={photoUrl} alt={person.name} sizes="128px" />
      </div>
      <h3 className="h3">{person.name}</h3>
      <p className="small-text mb-4">{person.title}</p>
      <p className="body-text max-w-lg mx-auto whitespace-pre-line text-left sm:text-center">
        {person.bio}
      </p>
    </div>
  );
}