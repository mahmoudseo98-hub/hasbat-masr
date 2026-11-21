"use client";

import { useEffect, useRef, useState } from "react";
import { DEFINITIONS } from "@/calculators/registry";
import type { CalcOutput, Values } from "@/calculators/types";
import { defaultValues, parseValues } from "@/calculators/validate";
import { CalculatorInput } from "./CalculatorInput";
import { ResultCard } from "./ResultCard";
import { CalculationBreakdown } from "./CalculationBreakdown";

export function CalculatorWidget({ id, title }: { id: string; title: string }) {
  const def = DEFINITIONS[id];
  const [values, setValues] = useState<Values>(() => defaultValues(def.fields));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<Extract<CalcOutput, { ok: true }> | null>(null);
  const [shareMsg, setShareMsg] = useState("");
  const resultRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const visible = def.fields.filter((f) => !f.showIf || f.showIf(values));

  function run(v: Values, focus: boolean) {
    const { parsed, errors: errs } = parseValues(def.fields, v);
    const out = Object.keys(errs).length ? ({ ok: false, errors: errs } as const) : def.compute(parsed);
    if (!out.ok) {
      setErrors(out.errors);
      setResult(null);
      if (focus) formRef.current?.querySelector<HTMLElement>(`#f-${Object.keys(out.errors)[0]}`)?.focus();
      return;
    }
    setErrors({});
    setResult(out);
    if (focus) resultRef.current?.focus();
  }

  // Prefill from a shared link (?amount=…) and calculate right away.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (![...params.keys()].some((k) => def.fields.some((f) => f.name === k))) return;
    const v = { ...defaultValues(def.fields) };
    for (const f of def.fields) if (params.has(f.name)) v[f.name] = params.get(f.name)!;
    // The URL is only readable after hydration (page is prerendered), so syncing it here is intended.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValues(v);
    run(v, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function update(name: string, val: string) {
    const v = { ...values, [name]: val };
    setValues(v);
    setShareMsg("");
    if (result) run(v, false); // live update once the user has calculated
  }

  function reset() {
    setValues(defaultValues(def.fields));
    setErrors({});
    setResult(null);
    setShareMsg("");
    window.history.replaceState(null, "", window.location.pathname);
  }

  async function share() {
    const qs = new URLSearchParams(Object.fromEntries(visible.map((f) => [f.name, values[f.name] ?? ""])));
    const url = `${window.location.origin}${window.location.pathname}?${qs}`;
    window.history.replaceState(null, "", url);
    try {
      if (navigator.share) {
        await navigator.share({ title, text: result ? `${result.headline.label}: ${result.headline.value}` : title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setShareMsg("اتنسخ رابط النتيجة ✓");
    } catch (e) {
      if ((e as Error).name !== "AbortError") setShareMsg("مقدرناش ننسخ الرابط — انسخه من شريط العنوان.");
    }
  }

  return (
    <div className="grid gap-6 rounded-3xl border border-line bg-white p-5 shadow-card sm:p-7 lg:grid-cols-5">
      <form
        ref={formRef}
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          run(values, true);
        }}
        className="space-y-5 lg:col-span-2"
        aria-label={title}
      >
        {visible.map((f) => (
          <CalculatorInput key={f.name} field={f} value={values[f.name] ?? ""} error={errors[f.name]} onChange={(v) => update(f.name, v)} />
        ))}
        <div className="flex flex-wrap gap-3 pt-1">
          <button type="submit" className="flex-1 rounded-xl bg-primary px-6 py-3 font-bold text-white hover:bg-primary-700">
            احسب
          </button>
          <button type="button" onClick={reset} className="rounded-xl border border-line px-5 py-3 font-semibold text-muted hover:bg-bg">
            إعادة ضبط
          </button>
        </div>
      </form>

      <div ref={resultRef} tabIndex={-1} className="lg:col-span-3 focus:outline-none" aria-live="polite">
        {result ? (
          <div className="space-y-5">
            <ResultCard result={result} />
            <CalculationBreakdown rows={result.breakdown} notes={result.notes} />
            <div className="flex flex-wrap items-center gap-3">
              <button type="button" onClick={share} className="rounded-xl border border-secondary px-5 py-2.5 font-semibold text-secondary hover:bg-secondary-50">
                شارك النتيجة
              </button>
              <span className="text-sm text-secondary" role="status">
                {shareMsg}
              </span>
            </div>
          </div>
        ) : (
          <div className="grid h-full min-h-48 place-items-center rounded-2xl border border-dashed border-line bg-bg p-6 text-center text-muted">
            <p>اكتب بياناتك واضغط «احسب» — النتيجة والتفاصيل هتظهر هنا.</p>
          </div>
        )}
      </div>
    </div>
  );
}
