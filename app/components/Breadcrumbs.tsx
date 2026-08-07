"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";

export type BreadcrumbItem = { label: string; href?: string };

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return (
    <nav
      aria-label="Breadcrumb"
      className={`text-xs text-sage mb-4 transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
    >
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-1.5">
            {item.href ? (
              <Link href={item.href} className="hover:text-forest transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-ink/70" aria-current="page">
                {item.label}
              </span>
            )}
            {i < items.length - 1 && <ChevronRight size={11} className="text-sage/60" aria-hidden="true" />}
          </li>
        ))}
      </ol>
    </nav>
  );
}