import { Link } from "@tanstack/react-router";

interface CTASectionProps {
  headline: string;
  subtitle?: string;
  buttonLabel: string;
  buttonHref: string;
}

export function CTASection({ headline, subtitle, buttonLabel, buttonHref }: CTASectionProps) {
  return (
    <section className="border-y border-slate-800 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-24">
        <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {headline}
        </h2>
        {subtitle && <p className="mx-auto mt-4 max-w-xl text-slate-300">{subtitle}</p>}
        <div className="mt-8">
          <Link
            to={buttonHref}
            className="inline-flex items-center rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-500"
          >
            {buttonLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
