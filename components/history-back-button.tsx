"use client";

import { useRouter } from "next/navigation";

type HistoryBackButtonProps = {
  ariaLabel?: string;
  className?: string;
  fallbackHref: string;
  restoreSessionKey?: string;
  restoreSessionValue?: string;
};

export function HistoryBackButton({
  ariaLabel = "Back",
  className,
  fallbackHref,
  restoreSessionKey,
  restoreSessionValue = "1",
}: HistoryBackButtonProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={className}
      onClick={() => {
        if (restoreSessionKey) {
          window.sessionStorage.setItem(restoreSessionKey, restoreSessionValue);
        }

        if (window.history.length > 1) {
          router.back();
          return;
        }

        router.push(fallbackHref);
      }}
    >
      <span aria-hidden="true">←</span>
    </button>
  );
}
