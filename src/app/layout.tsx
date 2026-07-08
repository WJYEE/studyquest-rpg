import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AppHydrator />
        <RpgHud />
        {children}
      </body>
    </html>
  );
}
