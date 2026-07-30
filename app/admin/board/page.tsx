import Link from "next/link";
import { getBoardMembersAdmin } from "@/lib/queries/boardMembers";
import DeleteBoardMemberButton from "../components/DeleteBoardMemberButton";

export default async function AdminBoardPage() {
  const members = await getBoardMembersAdmin();

  return (
    <main className="px-5 pt-6 pb-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="eyebrow mb-1">Haven Paws Admin</p>
          <h1 className="font-display text-2xl text-forest">Scientific Advisory Board</h1>
        </div>
        <Link
          href="/admin/board/new"
          className="bg-forest text-cream text-sm px-4 py-2 rounded-full hover:bg-forest-light"
        >
          + Add
        </Link>
      </div>

      {members.length === 0 ? (
        <p className="text-sage">No board members yet.</p>
      ) : (
        <div className="space-y-3">
          {members.map((m) => (
            <div key={m.id} className="flex items-center justify-between bg-white border border-sage/20 rounded-lg p-4">
              <div>
                <p className="text-forest font-medium">{m.name}</p>
                <p className="text-xs text-sage">{m.title}</p>
              </div>
              <div className="flex gap-3">
                <Link href={`/admin/board/${m.id}`} className="text-sm text-forest border-b border-gold pb-0.5">
                  Edit
                </Link>
                <DeleteBoardMemberButton id={m.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}