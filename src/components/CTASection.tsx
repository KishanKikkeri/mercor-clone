import Link from "next/link";

interface CTASectionProps {
  headline: string;
  subtitle?: string;
  buttonLabel: string;
  buttonHref: string;
}

export function CTASection({ headline, subtitle, buttonLabel, buttonHref }: CTASectionProps) {
  const cleanHref = buttonHref.replace(/^\/?/, "/");
  return (
    <section className="border-y border-purple-100 bg-gradient-to-b from-purple-50/30 to-white">
      <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20">
        <h2 className="text-balance text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {headline.replace(/Mercor/gi, "TalentBloom")}
        </h2>
        {subtitle && (
          <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base text-slate-600">
            {subtitle.replace(/Mercor/gi, "TalentBloom")}
          </p>
        )}
        <div className="mt-8">
          <Link
            href={cleanHref}
            className="inline-flex items-center rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-purple-700 hover:shadow-md hover:shadow-purple-100 active:scale-[0.98] btn-hover-effect"
          >
            {buttonLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
