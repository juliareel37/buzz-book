import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import type { ReactNode } from "react";
import { AppShell } from "@/components/app-shell";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Buzz Book",
  description: "Mobile-first drink tracking app shell",
  icons: {
    icon: "/icons/buzz.png",
    shortcut: "/icons/buzz.png",
    apple: "/icons/buzz.png",
  },
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${instrumentSerif.variable}`}>
        <ClerkProvider signInUrl="/sign-in" signUpUrl="/sign-up">
          <AppShell>{children}</AppShell>
        </ClerkProvider>
      </body>
    </html>
  );
}
