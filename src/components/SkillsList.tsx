interface SkillsListProps {
  skills: string[];
}

export function SkillsList({ skills }: SkillsListProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((s) => (
        <span
          key={s}
          className="inline-flex items-center rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-xs font-medium text-slate-200"
        >
          {s}
        </span>
      ))}
    </div>
  );
}
