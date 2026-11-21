import { parseUserNumber, formatNumber } from "../lib/format.ts";
import type { Field, Parsed, Values } from "./types.ts";

/** Validate raw form values against field rules. Only visible fields are checked and returned. */
export function parseValues(fields: Field[], values: Values): { parsed: Parsed; errors: Record<string, string> } {
  const parsed: Parsed = {};
  const errors: Record<string, string> = {};
  for (const f of fields) {
    if (f.showIf && !f.showIf(values)) continue;
    const raw = (values[f.name] ?? "").trim();
    if (f.type === "select") {
      if (!f.options.some((o) => o.value === raw)) errors[f.name] = "اختار قيمة من القائمة";
      else parsed[f.name] = raw;
      continue;
    }
    if (raw === "") {
      if (f.optional) parsed[f.name] = 0;
      else errors[f.name] = "الحقل ده مطلوب";
      continue;
    }
    const n = parseUserNumber(raw);
    if (!Number.isFinite(n)) errors[f.name] = "اكتب رقم صحيح (أرقام بس)";
    else if (f.min !== undefined && n < f.min) errors[f.name] = `أقل قيمة مسموحة ${formatNumber(f.min)}`;
    else if (f.max !== undefined && n > f.max) errors[f.name] = `أكبر قيمة مسموحة ${formatNumber(f.max)}`;
    else parsed[f.name] = n;
  }
  return { parsed, errors };
}

export function defaultValues(fields: Field[]): Values {
  return Object.fromEntries(fields.map((f) => [f.name, f.default ?? ""]));
}
