import Link from "next/link";
import type { CalculatorContent } from "@/calculators/types";
import { CategoryIcon } from "./Icon";
import { formatDateAr } from "@/lib/format";

export function CalculatorCard({ calc, showDate = false }: { calc: CalculatorContent; showDate?: boolean }) {
  return (
    <Link
      href={`/${calc.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-line bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:border-secondary motion-reduce:transition-none"
    >
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-secondary-50 text-secondary">
        <CategoryIcon id={calc.category} />
      </span>
      <h3 className="mt-3 font-bold text-primary group-hover:text-secondary">{calc.title}</h3>
      <p className="mt-1 line-clamp-3 text-sm text-muted">{calc.metaDescription}</p>
      <span className="mt-auto flex items-center justify-between pt-3 text-xs text-muted">
        {showDate ? <span>آخر تحديث: {formatDateAr(calc.lastUpdated)}</span> : <span />}
        {calc.status === "prototype" && <span className="rounded-full bg-accent-50 px-2 py-0.5 font-semibold text-[#8a5a00]">نموذج أولي</span>}
      </span>
    </Link>
  );
}
