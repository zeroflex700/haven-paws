import { Fragment } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageContainer from "../components/PageContainer";
import OptimizedImage from "../components/OptimizedImage";
import { getPuppies, type PuppyRecord } from "@/lib/queries/puppies";

const ROWS: { label: string; render: (p: PuppyRecord) => string }[] = [
  { label: "Breed", render: (p) => p.breed },
  { label: "Sex", render: (p) => p.sex },
  { label: "Age", render: (p) => (p.ageWeeks !== null ? `${p.ageWeeks} weeks` : "—") },
  { label: "Price", render: (p) => `$${p.price.toLocaleString()}` },
  { label: "Status", render: (p) => p.status },
  { label: "Availability", render: (p) => p.readyLabel },
];

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string }>;
}) {
  const { ids } = await searchParams;
  const idList = ids ? ids.split(",").filter(Boolean) : [];
  const all = await getPuppies();
  const puppies = all.filter((p) => idList.includes(p.id));

  return (
    <main>
      <Navbar />
      <PageContainer className="max-w-4xl py-8">
        <h1 className="h1 mb-6">Compare Puppies</h1>
        {puppies.length === 0 ? (
          <p className="small-text">
            No puppies selected. Go back to{" "}
            <Link href="/puppies" className="text-forest underline">
              Browse Puppies
            </Link>{" "}
            and tap the compare icon on a few you&apos;re considering.
          </p>
        ) : (
          <div className="overflow-x-auto -mx-6 px-6">
            <div
              className="min-w-[560px] grid"
              style={{ gridTemplateColumns: `140px repeat(${puppies.length}, 1fr)` }}
            >
              <div />
              {puppies.map((p) => (
                <Link key={p.id} href={`/puppies/${p.id}`} className="text-center px-2">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-cream-alt mx-auto mb-2">
                    <OptimizedImage src={p.coverImage} alt={p.name} sizes="64px" />
                  </div>
                  <p className="text-sm text-forest font-medium">{p.name}</p>
                </Link>
              ))}

              {ROWS.map((row) => (
                <Fragment key={row.label}>
                  <div className="text-xs text-sage py-3 border-t border-sage/15">{row.label}</div>
                  {puppies.map((p) => (
                    <div
                      key={p.id + row.label}
                      className="text-sm text-ink text-center py-3 border-t border-sage/15 capitalize"
                    >
                      {row.render(p)}
                    </div>
                  ))}
                </Fragment>
              ))}
            </div>
          </div>
        )}
      </PageContainer>
      <Footer />
    </main>
  );
}