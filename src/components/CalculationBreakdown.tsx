import type { Row } from "@/calculators/types";

export function CalculationBreakdown({ rows, notes }: { rows: Row[]; notes?: string[] }) {
  return (
    <div>
      <h3 className="mb-2 font-bold text-primary">تفاصيل الحساب</h3>
      <table className="w-full text-sm">
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={`border-b border-line align-top ${r.emphasis ? "bg-bg font-semibold" : ""}`}>
              <th scope="row" className="py-2.5 pl-3 text-right font-[inherit]">
                {r.label}
                {r.note && <span className="num mt-0.5 block text-xs font-normal text-muted">{r.note}</span>}
              </th>
              <td className="num whitespace-nowrap py-2.5 text-left">{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {notes && notes.length > 0 && (
        <ul className="mt-4 space-y-2 text-sm">
          {notes.map((n, i) => (
            <li key={i} className="rounded-lg border-r-4 border-accent bg-accent-50 px-3 py-2 text-ink">
              {n}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
