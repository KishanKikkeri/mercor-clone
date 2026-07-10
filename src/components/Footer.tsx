import Link from "next/link";
import { globalSettings } from "@/lib/mock-data";

export function Footer() {
  const logoName = globalSettings.logo || "TalentBloom";
  const isLogoUrl = logoName.startsWith("http") || logoName.startsWith("/");

  return (
    <footer className="border-t border-purple-50 bg-slate-50/50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-1.5 text-lg font-bold tracking-tight text-slate-900">
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
            </div>
            <p className="mt-3 max-w-sm text-sm text-slate-500">
              {globalSettings.footerDescription?.replace(/Mercor/gi, "TalentBloom") || 
                "Connecting people with work that matters at the world's most innovative companies."}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900">Explore</h4>
            <ul className="mt-4 space-y-2">
              {globalSettings.footerLinks.map((l) => {
                const url = l.url === "/" ? "/" : l.url.replace(/^\/?/, "/");
                return (
                  <li key={l.url}>
                    <Link
                      href={url}
                      className="text-sm text-slate-500 transition-colors hover:text-purple-600"
                    >
                      {l.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900">Follow</h4>
            <ul className="mt-4 space-y-2">
              {globalSettings.socialLinks.map((s) => (
                <li key={s.platform}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-slate-500 transition-colors hover:text-purple-600"
                  >
                    {s.platform}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-purple-100 pt-6 text-xs text-slate-400">
          {globalSettings.copyrightText?.replace(/Mercor/gi, "TalentBloom") || 
            `© ${new Date().getFullYear()} TalentBloom. All rights reserved.`}
        </div>
      </div>
    </footer>
  );
}
