import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CBT Prep Hub — Master Your Exams",
  description: "A premium computer-based test preparation platform.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={dmSans.className}>
      <body style={{ backgroundColor: "#080F1E", color: "#F0EEE9", minHeight: "100vh" }}>
        <Header />
        {children}
      </body>
    </html>
  );
}
