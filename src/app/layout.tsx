import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import { PersonalizeProvider } from "@/components/PersonalizeInitializer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "TalentBloom — Find work that moves you forward",
  description: "Discover opportunities at the world's most innovative companies.",
  keywords: ["jobs", "careers", "hiring", "remote work", "tech jobs", "talentbloom"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="flex min-h-screen flex-col bg-white font-sans antialiased text-slate-800 selection:bg-purple-100 selection:text-purple-900">
        <PersonalizeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster />
        </PersonalizeProvider>
      </body>
    </html>
  );
}
