import { PawPrint } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur border-b border-sage/20">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <a href="/" className="flex items-center gap-2">
          <PawPrint size={22} className="text-gold" strokeWidth={1.5} />
          <span className="font-display text-xl text-forest tracking-tight">
            Haven Paws
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-ink">
          <a href="/puppies" className="hover:text-forest">Available Puppies</a>
          <a href="/how-it-works" className="hover:text-forest">How It Works</a>
          <a href="/about" className="hover:text-forest">About</a>
        </nav>
        <a
          href="/contact"
          className="text-sm bg-forest text-cream px-5 py-2.5 rounded-full hover:bg-forest-light transition-colors"
        >
          Reserve a Visit
        </a>
      </div>
    </header>
  );
}