import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Limelightworld — Lime OS",
  description:
    "Lime OS by Limelightworld. A more refined desktop. Experience it in the browser.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sans.variable} h-full`}>
      <body className="min-h-full font-[family-name:var(--font-sans)]">{children}</body>
    </html>
  );
}
