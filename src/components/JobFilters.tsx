import { categories } from "@/lib/mock-data";

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
}

const selectClass =
  "mt-1.5 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

const labelClass = "text-xs font-medium uppercase tracking-wide text-slate-400";

export function JobFilters({ value, onChange }: JobFiltersProps) {
  const set = <K extends keyof JobFiltersState>(k: K, v: JobFiltersState[K]) =>
    onChange({ ...value, [k]: v });

  return (
    <aside className="rounded-xl border border-slate-800 bg-slate-950/60 p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Filters</h3>
        <button
          type="button"
          onClick={() => onChange(defaultJobFilters)}
          className="text-xs font-medium text-blue-400 hover:text-blue-300"
        >
          Clear
        </button>
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <label className={labelClass}>Search</label>
          <input
            type="text"
            value={value.query}
            onChange={(e) => set("query", e.target.value)}
            placeholder="Job title..."
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
            <option value="all">All</option>
            <option>Remote</option>
            <option>Hybrid</option>
            <option>On-site</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Employment Type</label>
          <select
            value={value.employmentType}
            onChange={(e) => set("employmentType", e.target.value)}
            className={selectClass}
          >
            <option value="all">All</option>
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Contract</option>
            <option>Internship</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Experience Level</label>
          <select
            value={value.experienceLevel}
            onChange={(e) => set("experienceLevel", e.target.value)}
            className={selectClass}
          >
            <option value="all">All</option>
            <option>Entry Level</option>
            <option>Mid Level</option>
            <option>Senior Level</option>
            <option>Lead</option>
          </select>
        </div>
      </div>
    </aside>
  );
}
