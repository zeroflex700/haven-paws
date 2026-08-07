"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AnimatedLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`relative inline-block py-1 transition-colors duration-200 ${
        isActive ? "text-forest" : "text-ink hover:text-forest"
      } ${className}`}
    >
      {children}
      <span
        className={`absolute -bottom-0.5 left-0 h-0.5 bg-gold transition-all duration-300 ease-out ${
          isActive ? "w-full" : "w-0"
        }`}
      />
    </Link>
  );
}