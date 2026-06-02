import type { Metadata } from "next";
import { fontDisplay, fontSans } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title:
    "George Attla – Making of a Champion – 54 Years of Competitive Sled Dog Racing: 1958-2011",
  description:
    "George Attla - Making of a Champion. 54 Years of Competitive Sled Dog Racing: 1958-2011",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full ${fontSans.variable} ${fontDisplay.variable}`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
