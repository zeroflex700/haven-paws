export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10 animate-pulse">
      <div className="h-4 w-24 bg-cream-alt rounded mb-4" />
      <div className="h-9 w-2/3 bg-cream-alt rounded mb-6" />
      <div className="aspect-video w-full bg-cream-alt rounded-lg mb-6" />
      <div className="h-4 bg-cream-alt rounded w-full mb-2" />
      <div className="h-4 bg-cream-alt rounded w-5/6 mb-2" />
      <div className="h-4 bg-cream-alt rounded w-3/4" />
    </div>
  );
}