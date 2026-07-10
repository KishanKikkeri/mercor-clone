interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}

export function SectionHeader({ title, subtitle, align = "left" }: SectionHeaderProps) {
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        {title.replace(/Mercor/gi, "TalentBloom")}
      </h2>
      {subtitle && (
        <p className={`mt-3 max-w-2xl text-sm sm:text-base text-slate-500 ${align === "center" ? "mx-auto" : ""}`}>
          {subtitle.replace(/Mercor/gi, "TalentBloom")}
        </p>
      )}
    </div>
  );
}
