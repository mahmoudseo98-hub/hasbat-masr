import type { CalcOutput } from "@/calculators/types";

type Ok = Extract<CalcOutput, { ok: true }>;

export function ResultCard({ result }: { result: Ok }) {
  return (
    <div className="rounded-2xl border border-secondary/30 bg-secondary-50 p-5">
      <p className="text-sm font-semibold text-secondary">{result.headline.label}</p>
      <p className="num mt-1 text-3xl font-bold text-primary sm:text-4xl">{result.headline.value}</p>
      {result.headline.sub && <p className="mt-1 text-sm text-muted">{result.headline.sub}</p>}
      {result.highlights && (
        <dl className="mt-4 grid gap-3 sm:grid-cols-3">
          {result.highlights.map((h) => (
            <div key={h.label} className="rounded-xl bg-white p-3">
              <dt className="text-xs text-muted">{h.label}</dt>
              <dd className="num font-bold text-ink">{h.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
