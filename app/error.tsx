"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <AlertCircle size={28} className="text-gold mx-auto mb-4" strokeWidth={1.5} />
        <h1 className="h1 mb-3">Something went wrong</h1>
        <p className="body-text mb-8">
          We hit an unexpected error loading this page. You can try again, or head back home.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="bg-forest text-cream text-sm px-6 py-2.5 rounded-full hover:bg-forest-light active:scale-95 transition-all"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="border border-forest/30 text-forest text-sm px-6 py-2.5 rounded-full hover:border-forest active:scale-95 transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}