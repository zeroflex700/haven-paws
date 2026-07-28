import AdminNav from "./components/AdminNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream pb-20">
      {children}
      <AdminNav />
    </div>
  );
}