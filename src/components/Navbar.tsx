import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { globalSettings } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-colors",
        scrolled
          ? "border-slate-800 bg-slate-950/80 backdrop-blur-md"
          : "border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-lg font-semibold tracking-tight text-white">
          {globalSettings.logo}
          <span className="text-blue-500">.</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {globalSettings.navLinks.map((l) => (
            <Link
              key={l.url}
              to={l.url}
              className="text-sm text-slate-300 transition-colors hover:text-white"
              activeProps={{ className: "text-white" }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/jobs"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
          >
            Explore Jobs
          </Link>
        </nav>

        <button
          className="inline-flex items-center justify-center rounded-md p-2 text-slate-200 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-800 bg-slate-950 md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
            {globalSettings.navLinks.map((l) => (
              <Link
                key={l.url}
                to={l.url}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm text-slate-200 hover:bg-slate-900"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/jobs"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-medium text-white hover:bg-blue-500"
            >
              Explore Jobs
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
