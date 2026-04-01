"use client";

import {
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { BottomTabs } from "@/components/bottom-tabs";
import { TimezoneSync } from "@/components/timezone-sync";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const { isLoaded, isSignedIn } = useUser();
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");
  const isSetupPage = pathname.startsWith("/onboarding");
  const hideChrome = isAuthPage || isSetupPage;

  return (
    <main className="app-shell">
      <TimezoneSync />
      <header className="top-bar">
        <span className="brand-wrap">
          <span className="brand-icon" aria-hidden="true" />
          <span className="brand">Buzz Book</span>
        </span>
        {!hideChrome ? (
          <div className="auth-slot">
            {isLoaded && !isSignedIn ? (
              <SignInButton mode="modal">
                <button type="button" className="sign-in-button">
                  Sign in
                </button>
              </SignInButton>
            ) : null}

            {isLoaded && isSignedIn ? (
              <div className="profile-button">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "user-avatar-box",
                    },
                  }}
                />
              </div>
            ) : null}
          </div>
        ) : null}
      </header>
      <div className="app-content">{children}</div>
      {!hideChrome ? <BottomTabs /> : null}
    </main>
  );
}
