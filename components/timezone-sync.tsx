"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const COOKIE_NAME = "buzz-book-timezone";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function getCookie(name: string) {
  const cookie = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${name}=`));

  if (!cookie) {
    return null;
  }

  return decodeURIComponent(cookie.split("=").slice(1).join("="));
}

export function TimezoneSync() {
  const router = useRouter();

  useEffect(() => {
    const browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    if (!browserTimeZone) {
      return;
    }

    const existingTimeZone = getCookie(COOKIE_NAME);

    if (existingTimeZone === browserTimeZone) {
      return;
    }

    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(browserTimeZone)}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
    router.refresh();
  }, [router]);

  return null;
}

