import { formatEGP, formatNumber, formatPercent } from "../../lib/format.ts";
import type { CalcOutput, CalculatorDefinition, Parsed, Row } from "../types.ts";
import { CERTIFICATES, PAYOUT_LABEL, PERIODS_PER_YEAR, type Payout } from "./rules.ts";

export interface CertificateResult {
  perYear: { year: number; rate: number; perPayout: number; total: number }[];
  totalReturn: number;
  totalAtMaturity: number;
  averageAnnualRate: number;
}

/** Simple interest on principal, paid each period at annualRate / periodsPerYear. */
export function certificateReturn(principal: number, yearlyRates: number[], payout: Payout): CertificateResult {
  if (!(principal > 0)) throw new Error("principal must be positive");
  if (yearlyRates.length === 0) throw new Error("tenor must be at least one year");
  const n = PERIODS_PER_YEAR[payout];
  const perYear = yearlyRates.map((rate, i) => ({
    year: i + 1,
    rate,
    perPayout: (principal * rate) / n,
    total: principal * rate,
  }));
  const totalReturn = perYear.reduce((s, y) => s + y.total, 0);
  return {
    perYear,
    totalReturn,
    totalAtMaturity: principal + totalReturn,
    averageAnnualRate: totalReturn / principal / yearlyRates.length,
  };
}

const presetOptions = CERTIFICATES.map((c) => ({
  value: c.id,
  label: `${c.bank} — ${c.name} (${PAYOUT_LABEL[c.payout]})`,
}));
const isCustom = (v: Record<string, string>) => v.certificate === "custom";

export const definition: CalculatorDefinition = {
  fields: [
    { name: "amount", label: "مبلغ الشهادة", type: "number", unit: "جنيه", min: 500, max: 1_000_000_000, default: "100000", help: "معظم الشهادات بتبدأ من 1,000 جنيه ومضاعفاتها." },
    { name: "certificate", label: "الشهادة", type: "select", options: [...presetOptions, { value: "custom", label: "شهادة تانية — هدخل العائد بنفسي" }], default: "bm-qimma-m" },
    { name: "rate", label: "سعر العائد السنوي", type: "number", unit: "%", min: 0.1, max: 60, default: "18", showIf: isCustom, help: "العائد السنوي المعلن من البنك، مثلًا 18.75" },
    { name: "years", label: "مدة الشهادة", type: "number", unit: "سنة", min: 1, max: 10, default: "3", showIf: isCustom },
    { name: "payout", label: "دورية صرف العائد", type: "select", options: [{ value: "monthly", label: "شهري" }, { value: "quarterly", label: "ربع سنوي" }, { value: "annual", label: "سنوي" }], default: "monthly", showIf: isCustom },
  ],
  compute(input: Parsed): CalcOutput {
    const amount = input.amount as number;
    let rates: number[];
    let payout: Payout;
    let label: string;
    const notes: string[] = [];
    if (input.certificate === "custom") {
      if (!Number.isInteger(input.years)) return { ok: false, errors: { years: "اكتب عدد سنين صحيح" } };
      rates = Array(input.years as number).fill((input.rate as number) / 100);
      payout = input.payout as Payout;
      label = "شهادة بعائد تدخله بنفسك";
    } else {
      const c = CERTIFICATES.find((x) => x.id === input.certificate)!;
      if (amount < c.minAmount) return { ok: false, errors: { amount: `الحد الأدنى للشهادة دي ${formatNumber(c.minAmount)} جنيه` } };
      if (amount % c.multiple !== 0) notes.push(`البنك بيصدر الشهادة دي بمضاعفات ${formatNumber(c.multiple)} جنيه، فالمبلغ الفعلي ممكن يتقرّب.`);
      rates = c.yearlyRates;
      payout = c.payout;
      label = `${c.bank} — ${c.name}`;
      if (c.confidence === "secondary") notes.push("سعر الشهادة دي منقول عن مصدر صحفي موثوق ولم نجده منشورًا على موقع البنك وقت التحديث — اتأكد من البنك قبل الشراء.");
    }
    const r = certificateReturn(amount, rates, payout);
    const periodName = PAYOUT_LABEL[payout];
    const declining = new Set(rates).size > 1;
    const breakdown: Row[] = [
      { label: "الشهادة", value: label },
      { label: "مبلغ الشهادة", value: formatEGP(amount) },
      ...r.perYear.map((y) => ({
        label: `السنة ${formatNumber(y.year)} — عائد ${formatPercent(y.rate)}`,
        value: `${formatEGP(y.perPayout, true)} ${periodName}`,
        note: `إجمالي السنة ${formatEGP(y.total)} = ${formatNumber(amount)} × ${formatPercent(y.rate)}`,
      })),
      { label: "إجمالي العائد طول المدة", value: formatEGP(r.totalReturn), emphasis: true },
      { label: "إجمالي ما تستلمه (العائد + أصل المبلغ)", value: formatEGP(r.totalAtMaturity) },
      { label: "الضريبة على العائد", value: "معفى للأفراد", note: "المادة 31 بند 5 من قانون الضريبة على الدخل 91 لسنة 2005" },
    ];
    if (declining) notes.push(`العائد متناقص: متوسطه السنوي ${formatPercent(r.averageAnnualRate)} على مدار المدة.`);
    notes.push("العائد بيبدأ من يوم العمل التالي للشراء، والأرقام تقديرية قبل أي تقريب يعمله البنك.");
    const first = r.perYear[0];
    return {
      ok: true,
      headline: { label: `العائد ال${periodName === "شهري" ? "شهري" : periodName === "سنوي" ? "سنوي" : "ربع سنوي"}${declining ? " في السنة الأولى" : ""}`, value: formatEGP(first.perPayout, true) },
      highlights: [
        { label: "إجمالي العائد", value: formatEGP(r.totalReturn) },
        { label: "المدة", value: `${formatNumber(rates.length)} سنين` },
      ],
      breakdown,
      notes,
    };
  },
};
