interface SkillsListProps {
  skills: string[];
}

export function SkillsList({ skills }: SkillsListProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((s) => (
        <span
          key={s}
          className="inline-flex items-center rounded-full border border-purple-50 bg-purple-50/50 px-3 py-1 text-xs font-semibold text-purple-700"
        >
          {s}
        </span>
      ))}
    </div>
  );
}
