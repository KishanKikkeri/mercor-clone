import { Link } from "@tanstack/react-router";
import { globalSettings } from "@/lib/mock-data";

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="text-lg font-semibold tracking-tight text-white">
              {globalSettings.logo}
              <span className="text-blue-500">.</span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-slate-400">
              {globalSettings.footerDescription}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white">Explore</h4>
            <ul className="mt-4 space-y-2">
              {globalSettings.footerLinks.map((l) => (
                <li key={l.url}>
                  <Link
                    to={l.url}
                    className="text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white">Follow</h4>
            <ul className="mt-4 space-y-2">
              {globalSettings.socialLinks.map((s) => (
                <li key={s.platform}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {s.platform}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-6 text-xs text-slate-500">
          {globalSettings.copyrightText}
        </div>
      </div>
    </footer>
  );
}
