"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PawPrint,
  ClipboardList,
  MessagesSquare,
  CalendarCheck,
  Truck,
  Settings,
} from "lucide-react";

const tabs = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/puppies",
    label: "Puppies",
    icon: PawPrint,
  },
  {
    href: "/admin/inquiries",
    label: "Inquiries",
    icon: ClipboardList,
  },
  {
    href: "/admin/messages",
    label: "Messages",
    icon: MessagesSquare,
  },
  {
    href: "/admin/reservations",
    label: "Reservations",
    icon: CalendarCheck,
  },
  {
    href: "/admin/content/delivery-programs",
    label: "Delivery",
    icon: Truck,
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: Settings,
  },
];

export default function AdminNav() {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around overflow-x-auto border-t border-forest-light bg-forest py-2">
      {tabs.map(({ href, label, icon: Icon }) => {
        const active =
          href === "/admin"
            ? pathname === href
            : pathname === href ||
              pathname.startsWith(`${href}/`);

        return (
          <Link
            key={href}
            href={href}
            className={`flex shrink-0 flex-col items-center gap-1 px-3 py-1 text-xs ${
              active
                ? "text-gold"
                : "text-cream/60"
            }`}
          >
            <Icon
              size={20}
              strokeWidth={1.5}
            />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}