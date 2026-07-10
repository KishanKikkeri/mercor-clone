import type { Category } from "@/lib/types";

export interface JobFiltersState {
  query: string;
  category: string;
  workType: string;
  employmentType: string;
  experienceLevel: string;
}

export const defaultJobFilters: JobFiltersState = {
  query: "",
  category: "all",
  workType: "all",
  employmentType: "all",
  experienceLevel: "all",
};

interface JobFiltersProps {
  value: JobFiltersState;
  onChange: (v: JobFiltersState) => void;
  categories: Category[];
}

const selectClass =
  "mt-1.5 w-full rounded-lg border border-purple-100 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all duration-200";

const labelClass = "text-xs font-bold uppercase tracking-wider text-slate-500";

export function JobFilters({ value, onChange, categories }: JobFiltersProps) {
  const set = <K extends keyof JobFiltersState>(k: K, v: JobFiltersState[K]) =>
    onChange({ ...value, [k]: v });

  return (
    <aside className="rounded-xl border border-purple-100 bg-white p-5 shadow-sm h-fit">
      <div className="flex items-center justify-between pb-3 border-b border-purple-50">
        <h3 className="text-sm font-bold text-slate-900">Filters</h3>
        <button
          type="button"
          onClick={() => onChange(defaultJobFilters)}
          className="text-xs font-semibold text-purple-600 hover:text-purple-700 transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="mt-5 space-y-5">
        <div>
          <label className={labelClass}>Search</label>
          <input
            type="text"
            value={value.query}
            onChange={(e) => set("query", e.target.value)}
            placeholder="Job title or keyword..."
            className={selectClass}
          />
        </div>

        <div>
          <label className={labelClass}>Category</label>
          <select
            value={value.category}
            onChange={(e) => set("category", e.target.value)}
            className={selectClass}
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Work Type</label>
          <select
            value={value.workType}
            onChange={(e) => set("workType", e.target.value)}
            className={selectClass}
          >
            <option value="all">All Work Types</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="On-site">On-site</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Employment Type</label>
          <select
            value={value.employmentType}
            onChange={(e) => set("employmentType", e.target.value)}
            className={selectClass}
          >
            <option value="all">All Employment Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Experience Level</label>
          <select
            value={value.experienceLevel}
            onChange={(e) => set("experienceLevel", e.target.value)}
            className={selectClass}
          >
            <option value="all">All Experience Levels</option>
            <option value="Entry Level">Entry Level</option>
            <option value="Mid Level">Mid Level</option>
            <option value="Senior Level">Senior Level</option>
            <option value="Lead">Lead</option>
          </select>
        </div>
      </div>
    </aside>
  );
}
