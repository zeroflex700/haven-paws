import { createClient } from "@/lib/supabase/server";

export default async function AdminBreederApplicationsPage() {
  const supabase = await createClient();
  const { data: applications } = await supabase
    .from("breeder_applications")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="px-5 pt-6 pb-10">
      <p className="eyebrow mb-1">Haven Paws Admin</p>
      <h1 className="font-display text-2xl text-forest mb-6">Breeder Applications</h1>

      {!applications || applications.length === 0 ? (
        <p className="text-sage">No applications yet.</p>
      ) : (
        <div className="space-y-3">
          {applications.map((a) => (
            <div key={a.id} className="bg-white border border-sage/20 rounded-lg p-4">
              <p className="text-forest font-medium">{a.full_name}</p>
              <p className="text-sm text-ink/70">{a.email} {a.phone ? `· ${a.phone}` : ""}</p>
              {a.location && <p className="text-sm text-ink/70">{a.location}</p>}
              {a.breeds && <p className="text-sm text-ink/70 mt-1">Breeds: {a.breeds}</p>}
              {a.years_breeding && <p className="text-sm text-ink/70">Experience: {a.years_breeding}</p>}
              {a.message && <p className="text-sm text-ink/80 mt-2">{a.message}</p>}
              <p className="text-xs text-sage mt-2">
                {new Date(a.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}