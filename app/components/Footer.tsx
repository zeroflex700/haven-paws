export default function Footer() {
  return (
    <footer className="bg-forest text-cream py-12">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-6">
        <div>
          <span className="font-display text-lg">Haven Paws</span>
          <p className="text-cream/60 text-sm mt-2 max-w-xs">
            A curated home for every puppy.
          </p>
        </div>
        <div className="text-sm text-cream/70 space-y-2">
          <p>hello@havenpaws.com</p>
          <p>© {new Date().getFullYear()} Haven Paws. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}