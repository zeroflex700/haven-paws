"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PawPrint, MessageSquare, CalendarCheck } from "lucide-react";

const tabs = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/puppies", label: "Puppies", icon: PawPrint },
  { href: "/admin/inquiries", label: "Inquiries", icon: MessageSquare },
  { href: "/admin/reservations", label: "Reservations", icon: CalendarCheck },
];

export default function AdminNav() {
  const pathname = usePathname();
  if (pathname === "/admin/login") return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-forest border-t border-forest-light flex justify-around py-2 z-50">
      {tabs.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center gap-1 px-3 py-1 text-xs ${
              active ? "text-gold" : "text-cream/60"
            }`}
          >
            <Icon size={20} strokeWidth={1.5} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}