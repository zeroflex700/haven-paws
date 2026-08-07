import OptimizedImage from "./OptimizedImage";
import type { BoardMember } from "@/lib/queries/boardMembers";

export default function BoardCarousel({ members }: { members: BoardMember[] }) {
  if (members.length === 0) return null;

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 snap-x">
      {members.map((m) => (
        <div key={m.id} className="w-40 shrink-0 snap-start text-center">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-cream-alt mx-auto mb-3">
            <OptimizedImage src={m.photoUrl} alt={m.name} sizes="128px" />
          </div>
          <p className="text-forest font-medium text-sm">{m.name}</p>
          {m.title && <p className="text-xs text-ink/60 mt-1">{m.title}</p>}
        </div>
      ))}
    </div>
  );
}