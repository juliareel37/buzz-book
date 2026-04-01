"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

type HomeScreenTransitionProps = {
  children: ReactNode;
};

export function HomeScreenTransition({ children }: HomeScreenTransitionProps) {
  const [isEntering, setIsEntering] = useState(false);

  useEffect(() => {
    const transition = sessionStorage.getItem("buzz-book-transition");

    if (transition === "home-enter") {
      sessionStorage.removeItem("buzz-book-transition");
      setIsEntering(true);

      const timeout = window.setTimeout(() => {
        setIsEntering(false);
      }, 220);

      return () => window.clearTimeout(timeout);
    }
  }, []);

  return <section className={`home-screen${isEntering ? " is-entering" : ""}`}>{children}</section>;
}
