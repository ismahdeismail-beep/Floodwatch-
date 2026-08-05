import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "FloodWatch AI — Predict. Warn. Protect.",
    template: "%s | FloodWatch AI",
  },
  description:
    "Autonomous AI-powered flood intelligence & early warning platform for Africa. Predict. Warn. Protect.",
  keywords: ["flood", "early warning", "AI", "Kenya", "Africa", "climate resilience"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="flex min-h-screen flex-col bg-slate-950 text-slate-200">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
