import type { ReactNode } from "react";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  children?: ReactNode;
  size?: "sm" | "lg";
}

export function PageHero({ title, subtitle, eyebrow, children, size = "sm" }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-purple-100 bg-gradient-to-b from-purple-50/60 via-purple-50/20 to-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.1),transparent_60%)]"
      />
      <div className="relative mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:py-28">
        {eyebrow && (
          <div className="mb-4 inline-flex items-center rounded-full border border-purple-100 bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-600 tracking-wide">
            {eyebrow.replace(/Mercor/gi, "TalentBloom")}
          </div>
        )}
        <h1
          className={
            size === "lg"
              ? "text-balance text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
              : "text-balance text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl"
          }
        >
          {title.replace(/Mercor/gi, "TalentBloom")}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base sm:text-lg text-slate-600">
            {subtitle.replace(/Mercor/gi, "TalentBloom")}
          </p>
        )}
        {children && <div className="mt-8 flex flex-wrap items-center justify-center gap-3">{children}</div>}
      </div>
    </section>
  );
}
