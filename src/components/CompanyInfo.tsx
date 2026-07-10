import { ExternalLink } from "lucide-react";
import type { Company } from "@/lib/types";

interface CompanyInfoProps {
  company: Company;
}

export function CompanyInfo({ company }: CompanyInfoProps) {
  return (
    <div className="rounded-xl border border-purple-100 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <img
          src={company.logo}
          alt={company.name}
          className="h-14 w-14 rounded-xl border border-purple-50 bg-slate-50 object-cover"
        />
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-slate-900">{company.name}</h3>
          <p className="text-sm text-slate-500 font-medium">
            {company.industry} · {company.headquarters}
          </p>
        </div>
      </div>
      <p className="mt-4 text-sm text-slate-600 leading-relaxed">{company.description}</p>
      <a
        href={company.website}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors"
      >
        Visit Website
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}
