import type { Metadata } from "next";
import { Geist, Geist_Mono, Silkscreen } from "next/font/google";
import { AppHydrator } from "../components/AppHydrator";
import { RpgHud } from "../components/rpg/RpgHud";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Pixel display font — reserved for page titles and badge/ribbon chips
 * only (docs/02_design/art-direction.md §6). Not body copy, buttons, or
 * nav; see globals.css's `font-pixel` mapping.
 */
const silkscreen = Silkscreen({
  variable: "--font-pixel",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StudyQuest",
  description: "Study time becomes character growth.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${silkscreen.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col pb-16">
        {/* pb-16 reserves space for RpgHud's fixed bottom nav bar so it never covers page content. */}
        <AppHydrator />
        <RpgHud />
        {children}
      </body>
    </html>
  );
}
