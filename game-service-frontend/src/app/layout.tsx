import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/layout/navbar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "HyperIndoStore",
  description: "Game Service Marketplace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={cn(
        geistSans.variable,
        geistMono.variable
      )}
    >
      <body className="antialiased bg-black text-white overflow-x-hidden">

        <Navbar />

        <main className="pt-20 min-h-screen overflow-y-auto">
          {children}
        </main>

      </body>
    </html>
  );
}