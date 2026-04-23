import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/layout/navbar"; // ✅ TAMBAH

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
    <html lang="id" className={cn(geistSans.variable, geistMono.variable)}>
      <body className="antialiased bg-black text-white">

        {/* ✅ GLOBAL NAVBAR */}
        <Navbar />

        {/* ✅ CONTENT */}
        <main className="pt-20">
          {children}
        </main>

      </body>
    </html>
  );
}