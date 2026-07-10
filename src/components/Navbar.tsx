"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { globalSettings } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const logoName = globalSettings.logo || "TalentBloom";
  const isLogoUrl = logoName.startsWith("http") || logoName.startsWith("/");

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-200",
        scrolled
          ? "border-purple-100 bg-white/90 backdrop-blur-md shadow-sm"
          : "border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900">
          {isLogoUrl ? (
            <img src={logoName} alt="TalentBloom Logo" className="h-8 w-auto object-contain" />
          ) : (
            <>
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                {logoName === "Mercor" ? "TalentBloom" : logoName}
              </span>
              <span className="text-purple-600">.</span>
            </>
          )}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {globalSettings.navLinks.map((l) => {
            const url = l.url === "/" ? "/" : l.url.replace(/^\/?/, "/");
            const isActive = pathname === url;
            return (
              <Link
                key={l.url}
                href={url}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-purple-600",
                  isActive ? "text-purple-600 font-semibold" : "text-slate-600"
                )}
              >
                {l.label}
              </Link>
            );
          })}
          <Link
            href="/jobs"
            className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-purple-700 hover:shadow-md hover:shadow-purple-100 active:scale-[0.98]"
          >
            Explore Jobs
          </Link>
        </nav>

        <button
          className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-purple-50 hover:text-purple-600 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-purple-100 bg-white md:hidden shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
            {globalSettings.navLinks.map((l) => {
              const url = l.url === "/" ? "/" : l.url.replace(/^\/?/, "/");
              const isActive = pathname === url;
              return (
                <Link
                  key={l.url}
                  href={url}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-purple-50 text-purple-600" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  {l.label}
                </Link>
              );
            })}
            <Link
              href="/jobs"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-lg bg-purple-600 px-3 py-2 text-center text-sm font-medium text-white hover:bg-purple-700 hover:shadow-md"
            >
              Explore Jobs
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
