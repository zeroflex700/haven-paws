import { getBoardMemberAdmin } from "@/lib/queries/boardMembers";
import BoardMemberForm from "../../components/BoardMemberForm";
import { notFound } from "next/navigation";

export default async function EditBoardMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const member = await getBoardMemberAdmin(id);
  if (!member) notFound();

  return (
    <main className="px-5 pt-6">
      <p className="eyebrow mb-1">Haven Paws Admin</p>
      <h1 className="font-display text-2xl text-forest mb-6">Edit Board Member</h1>
      <BoardMemberForm member={member} />
    </main>
  );
}