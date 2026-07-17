import Link from "next/link";
import type { Category } from "@/lib/types";

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group flex h-full flex-col rounded-xl border border-purple-100 bg-white p-6 shadow-sm card-hover-effect"
    >
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-purple-50 bg-purple-50/50 text-purple-600 transition-colors group-hover:bg-purple-50 group-hover:text-purple-700">
          {category.icon?.startsWith("http") ? (
            <img src={category.icon} alt={category.name} className="h-7 w-7 object-contain" />
          ) : (
            <span className="text-2xl">{category.icon}</span>
          )}
        </div>
        <span className="rounded-full border border-purple-50 bg-purple-50/40 px-3 py-1 text-xs font-semibold text-purple-700">
          {category.jobCount} {category.jobCount === 1 ? "Job" : "Jobs"}
        </span>
      </div>
      <h3 className="mt-5 text-lg font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
        {category.name}
      </h3>
      <p className="mt-2 text-sm text-slate-500 leading-relaxed flex-1">
        {category.shortDescription}
      </p>
    </Link>
  );
}
