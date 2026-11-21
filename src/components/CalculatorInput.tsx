import type { Field } from "@/calculators/types";

export function CalculatorInput({ field, value, error, onChange }: { field: Field; value: string; error?: string; onChange: (v: string) => void }) {
  const id = `f-${field.name}`;
  const describedBy = [field.help && `${id}-help`, error && `${id}-err`].filter(Boolean).join(" ") || undefined;
  const base = `w-full rounded-xl border bg-white px-4 py-3 text-ink focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30 ${error ? "border-danger" : "border-line"}`;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block font-semibold text-ink">
        {field.label}
        {field.type === "number" && field.optional && <span className="font-normal text-muted"> (اختياري)</span>}
      </label>
      {field.type === "select" ? (
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={base} aria-describedby={describedBy} aria-invalid={!!error}>
          {field.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <div className="relative">
          <input
            id={id}
            type="text"
            inputMode="decimal"
            dir="ltr"
            value={value}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
            className={`${base} num text-left ${field.unit ? "pr-20" : ""}`}
            aria-describedby={describedBy}
            aria-invalid={!!error}
            aria-required={!field.optional}
          />
          {field.unit && <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm text-muted">{field.unit}</span>}
        </div>
      )}
      {field.help && (
        <p id={`${id}-help`} className="mt-1 text-sm text-muted">
          {field.help}
        </p>
      )}
      {error && (
        <p id={`${id}-err`} className="mt-1 text-sm font-semibold text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
