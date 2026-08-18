export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-6 pb-16">
      <div className="h-11 bg-cream-alt rounded-full mb-6 max-w-md animate-pulse" />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-7">
        {Array.from({ length: 10 }).map(
          (_, index) => (
            <div key={index}>
              <div className="aspect-square rounded-lg bg-cream-alt animate-pulse mb-1.5" />

              <div className="h-3 bg-cream-alt rounded w-3/4 animate-pulse mb-1.5" />

              <div className="h-3 bg-cream-alt rounded w-1/2 animate-pulse" />
            </div>
          )
        )}
      </div>
    </div>
  );
}