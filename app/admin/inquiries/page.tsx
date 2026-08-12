import { getAllInquiriesAdmin } from "@/lib/queries/adminInquiries";
import InquiryStatusSelect from "../components/InquiryStatusSelect";

export default async function AdminInquiriesPage() {
  const inquiries = await getAllInquiriesAdmin();

  return (
    <main className="px-5 pt-6 pb-10">
      <p className="eyebrow mb-1">Haven Paws Admin</p>
      <h1 className="font-display text-2xl text-forest mb-6">Inquiries</h1>

      {inquiries.length === 0 ? (
        <p className="text-sage">No inquiries yet.</p>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inq) => (
            <div key={inq.id} className="bg-white border border-sage/20 rounded-lg p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <p className="text-forest font-medium">{inq.customerName}</p>
                  <p className="text-xs text-sage">
                    {inq.customerEmail}
                    {inq.customerPhone ? ` · ${inq.customerPhone}` : ""}
                  </p>
                  {inq.puppyName && (
                    <p className="text-xs text-sage mt-0.5">Re: {inq.puppyName}</p>
                  )}
                </div>
                <InquiryStatusSelect id={inq.id} status={inq.status} />
              </div>
              {inq.message && (
                <p className="text-sm text-ink/80 mt-2 leading-relaxed">{inq.message}</p>
              )}
              <p className="text-[11px] text-sage mt-2">
                {new Date(inq.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}