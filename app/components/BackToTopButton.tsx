"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 600);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="fixed right-4 z-40 w-10 h-10 rounded-full bg-forest text-cream shadow-lg flex items-center justify-center hover:bg-forest-light transition-colors"
      style={{ bottom: "calc(env(safe-area-inset-bottom) + 1.25rem)" }}
    >
      <ArrowUp size={16} />
    </button>
  );
}