"use client";

import type { ReactNode } from "react";
import Link from "next/link";

type AddDrinkLinkProps = {
  children: ReactNode;
  className?: string;
  href: string;
};

export function AddDrinkLink({ children, className, href }: AddDrinkLinkProps) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => {
        sessionStorage.setItem("buzz-book-transition", "log-enter");
      }}
    >
      {children}
    </Link>
  );
}
