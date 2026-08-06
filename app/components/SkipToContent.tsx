export default function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:bg-forest focus:text-cream focus:px-4 focus:py-2 focus:rounded-full focus:text-sm"
    >
      Skip to content
    </a>
  );
}