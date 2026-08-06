import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type BreadcrumbItem = { label: string; href?: string };

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-sage mb-4">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-1">
            {item.href ? (
              <Link href={item.href} className="hover:text-forest">
                {item.label}
              </Link>
            ) : (
              <span className="text-ink/70" aria-current="page">
                {item.label}
              </span>
            )}
            {i < items.length - 1 && <ChevronRight size={11} className="text-sage/60" />}
          </li>
        ))}
      </ol>
    </nav>
  );
}