import type { Source } from "@/calculators/types";
import { formatDateAr } from "@/lib/format";

export function SourceReferences({ sources }: { sources: Source[] }) {
  return (
    <ol className="space-y-3">
      {sources.map((s) => (
        <li key={s.url + s.title} className="rounded-xl border border-line bg-white p-4">
          <a href={s.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline decoration-line underline-offset-4 hover:decoration-secondary">
            {s.title}
          </a>
          <p className="mt-1 flex flex-wrap gap-x-3 text-sm text-muted">
            <span>{s.publisher}</span>
            <span className={s.kind === "official" ? "text-secondary" : "text-[#8a5a00]"}>{s.kind === "official" ? "مصدر رسمي" : "مصدر ثانوي (صحفي/استشاري)"}</span>
            {s.effectiveDate && <span>ساري من: {formatDateAr(s.effectiveDate)}</span>}
          </p>
        </li>
      ))}
    </ol>
  );
}
