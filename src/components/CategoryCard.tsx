import { Link } from "@tanstack/react-router";
import type { Category } from "@/lib/types";

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      to="/categories/$slug"
      params={{ slug: category.slug }}
      className="group flex h-full flex-col rounded-xl border border-slate-800 bg-slate-950/60 p-6 transition-all hover:border-blue-500/40 hover:bg-slate-900"
    >
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-slate-800 bg-slate-900">
          {category.icon?.startsWith("http") ? (
            <img
              src={category.icon}
              alt={category.name}
              className="h-7 w-7 object-contain"
            />
          ) : (
            <span className="text-2xl">{category.icon}</span>
          )}
        </div>
        <span className="rounded-full border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs font-medium text-slate-300">
          {category.jobCount} Jobs
        </span>
      </div>
      <h3 className="mt-5 text-lg font-semibold text-white group-hover:text-blue-400">
        {category.name}
      </h3>
      <p className="mt-2 text-sm text-slate-400">{category.shortDescription}</p>
    </Link>
  );
}