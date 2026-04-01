"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "Home", icon: "/icons/home.svg" },
  { href: "/log", label: "Add", icon: "/icons/add.svg" },
  { href: "/trends", label: "Activity", icon: "/icons/timeline.svg" },
  { href: "/settings", label: "Profile", icon: "/icons/profile.svg" },
];

export function BottomTabs() {
  const pathname = usePathname();

  return (
    <nav className="bottom-tabs" aria-label="Primary">
      {tabs.map((tab) => {
        const isActive =
          tab.href === "/"
            ? pathname === tab.href
            : pathname === tab.href || pathname.startsWith(`${tab.href}/`);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`tab-link${isActive ? " active" : ""}`}
            aria-current={isActive ? "page" : undefined}
          >
            <span className="tab-icon" aria-hidden="true">
              <span
                className="tab-icon-image"
                style={
                  {
                    "--icon-url": `url(${tab.icon})`,
                  } as CSSProperties
                }
              />
            </span>
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
