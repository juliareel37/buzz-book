"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "Home", icon: "◎" },
  { href: "/log", label: "Add", icon: "+" },
  { href: "/trends", label: "Trends", icon: "≈" },
  { href: "/settings", label: "Settings", icon: "◌" },
];

export function BottomTabs() {
  const pathname = usePathname();

  return (
    <nav className="bottom-tabs" aria-label="Primary">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`tab-link${isActive ? " active" : ""}`}
            aria-current={isActive ? "page" : undefined}
          >
            <span className="tab-icon" aria-hidden="true">
              {tab.icon}
            </span>
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
