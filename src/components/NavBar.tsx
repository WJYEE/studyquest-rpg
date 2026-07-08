"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/subjects", label: "Subjects" },
  { href: "/timer", label: "Timer" },
  { href: "/character", label: "Character" },
  { href: "/shop", label: "Shop" },
  { href: "/dashboard", label: "Dashboard" },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-gray-200">
      <ul className="mx-auto flex w-full max-w-lg flex-wrap gap-x-4 gap-y-2 px-4 py-3 text-sm">
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={
                  isActive
                    ? "font-semibold text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
