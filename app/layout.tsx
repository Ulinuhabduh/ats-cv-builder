import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ATS CV Builder — Build an ATS-Friendly Resume",
  description:
    "A free platform to build ATS-friendly resumes: live editor, multiple templates, ATS score analysis, and PDF export.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
