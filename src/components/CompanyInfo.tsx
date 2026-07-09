import { ExternalLink } from "lucide-react";
import type { Company } from "@/lib/types";

interface CompanyInfoProps {
  company: Company;
}

export function CompanyInfo({ company }: CompanyInfoProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-6">
      <div className="flex items-start gap-4">
        <img
          src={company.logo}
          alt={company.name}
          className="h-14 w-14 rounded-md border border-slate-800 bg-slate-900 object-cover"
        />
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-white">{company.name}</h3>
          <p className="text-sm text-slate-400">
            {company.industry} · {company.headquarters}
          </p>
        </div>
      </div>
      <p className="mt-4 text-sm text-slate-300">{company.description}</p>
      <a
        href={company.website}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-blue-400 hover:text-blue-300"
      >
        Visit Website
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}
