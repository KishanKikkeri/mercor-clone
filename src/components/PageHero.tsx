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
    <section className="relative overflow-hidden border-b border-slate-800 bg-slate-950">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_55%)]"
      />
      <div className="relative mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 sm:py-24 lg:py-32">
        {eyebrow && (
          <div className="mb-4 inline-flex items-center rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-xs font-medium text-blue-400">
            {eyebrow}
          </div>
        )}
        <h1
          className={
            size === "lg"
              ? "text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl"
              : "text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl"
          }
        >
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-slate-300">
            {subtitle}
          </p>
        )}
        {children && <div className="mt-8 flex flex-wrap items-center justify-center gap-3">{children}</div>}
      </div>
    </section>
  );
}
