import BoardMemberForm from "../../components/BoardMemberForm";

export default function NewBoardMemberPage() {
  return (
    <main className="px-5 pt-6">
      <p className="eyebrow mb-1">Haven Paws Admin</p>
      <h1 className="font-display text-2xl text-forest mb-6">Add Board Member</h1>
      <BoardMemberForm />
    </main>
  );
}