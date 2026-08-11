export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-8 animate-pulse">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-16 h-16 rounded-full bg-cream-alt" />
        <div>
          <div className="h-5 w-40 bg-cream-alt rounded mb-2" />
          <div className="h-3 w-28 bg-cream-alt rounded" />
        </div>
      </div>
      <div className="h-6 w-48 bg-cream-alt rounded mb-4" />
      <div className="aspect-video w-full bg-cream-alt rounded-lg mb-4" />
      <div className="h-4 bg-cream-alt rounded w-full mb-2" />
      <div className="h-4 bg-cream-alt rounded w-4/5" />
    </div>
  );
}