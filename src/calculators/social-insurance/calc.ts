import { formatEGP, formatNumber, formatPercent } from "../../lib/format.ts";
import type { CalcOutput, CalculatorDefinition, Parsed, Row } from "../types.ts";
import { YEARS, type InsuranceYear } from "./rules.ts";

export function insurableWage(wage: number, y: InsuranceYear) {
  return Math.min(Math.max(wage, y.minWage), y.maxWage);
}

const sum = (xs: { rate: number }[]) => xs.reduce((s, x) => s + x.rate, 0);

export function employeeContributions(wage: number, y: InsuranceYear) {
  const base = insurableWage(wage, y);
  return {
    base,
    employee: base * sum(y.employee),
    employer: base * sum(y.employer),
    employeeRate: sum(y.employee),
    employerRate: sum(y.employer),
  };
}

export const definition: CalculatorDefinition = {
  fields: [
    { name: "type", label: "نوع المؤمن عليه", type: "select", options: [{ value: "employee", label: "موظف في القطاع الخاص (عامل لدى الغير)" }, { value: "self", label: "صاحب عمل أو عامل لحساب نفسه / مصري بالخارج" }], default: "employee" },
    { name: "year", label: "سنة الحساب", type: "select", options: YEARS.map((y) => ({ value: String(y.year), label: `${y.year}${y.confidence === "secondary" ? " (معلنة إعلاميًا — بانتظار القرار الرسمي)" : ""}` })), default: "2026" },
    { name: "wage", label: "أجر الاشتراك الشهري", type: "number", unit: "جنيه", min: 1, max: 10_000_000, default: "10000", help: "للموظف: الأجر اللي صاحب العمل بيأمّن عليه (غالبًا الأجر الشامل ما عدا بعض البدلات). لصاحب العمل: دخل الاشتراك اللي بتختاره." },
  ],
  compute(input: Parsed): CalcOutput {
    const y = YEARS.find((x) => String(x.year) === input.year)!;
    const wage = input.wage as number;
    const notes: string[] = [];
    if (y.confidence === "secondary") notes.push(`أرقام ${y.year} منقولة عن تصريحات رئيس هيئة التأمينات والنص القانوني (زيادة 1% كل 7 سنين)، ولسه مصدرش بيها منشور رسمي على موقع الهيئة.`);
    if (wage < y.minWage) notes.push(`أجرك أقل من الحد الأدنى لأجر الاشتراك (${formatEGP(y.minWage)})، فالاشتراك بيتحسب على الحد الأدنى.`);
    if (wage > y.maxWage) notes.push(`أجرك أكبر من الحد الأقصى (${formatEGP(y.maxWage)})، فالاشتراك بيتحسب على الحد الأقصى بس.`);

    if (input.type === "self") {
      if (y.selfEmployedRate === null) return { ok: false, errors: { year: `نسبة اشتراك أصحاب الأعمال لسنة ${y.year} لم تُعلن رسميًا بعد — اختار 2026` } };
      const base = Math.min(Math.max(wage, y.minWage), y.maxWage);
      const monthly = base * y.selfEmployedRate;
      return {
        ok: true,
        headline: { label: "اشتراكك الشهري", value: formatEGP(monthly), sub: `${formatPercent(y.selfEmployedRate, 2)} من دخل الاشتراك، وبتدفعه أنت بالكامل` },
        highlights: [{ label: "في السنة", value: formatEGP(monthly * 12) }, { label: "دخل الاشتراك المحتسب", value: formatEGP(base) }],
        breakdown: [
          { label: "دخل الاشتراك اللي اخترته", value: formatEGP(wage) },
          { label: `دخل الاشتراك بعد تطبيق الحدود (${formatNumber(y.minWage)}–${formatNumber(y.maxWage)})`, value: formatEGP(base), emphasis: true },
          { label: `الاشتراك ${formatPercent(y.selfEmployedRate, 2)}`, value: formatEGP(monthly), emphasis: true },
        ],
        notes: [...notes, "الهيئة بتحدد شرائح دخل اشتراك محددة لأصحاب الأعمال؛ لازم تختار شريحة منهم ومتقلش عن أعلى أجر تأميني لعمالك ولا عن دخلك الخاضع للضريبة.", "في محافظات التأمين الصحي الشامل ممكن تتضاف نسبة تأمين مرض — راجع الهيئة."],
      };
    }

    const c = employeeContributions(wage, y);
    const breakdown: Row[] = [
      { label: "الأجر اللي كتبته", value: formatEGP(wage) },
      { label: `أجر الاشتراك المحتسب (بين ${formatNumber(y.minWage)} و${formatNumber(y.maxWage)})`, value: formatEGP(c.base), emphasis: true },
      ...y.employee.map((x) => ({ label: `حصة الموظف — ${x.label} ${formatPercent(x.rate, 2)}`, value: formatEGP(c.base * x.rate) })),
      { label: `إجمالي حصة الموظف ${formatPercent(c.employeeRate, 2)}`, value: formatEGP(c.employee), emphasis: true },
      ...y.employer.map((x) => ({ label: `حصة صاحب العمل — ${x.label} ${formatPercent(x.rate, 2)}`, value: formatEGP(c.base * x.rate) })),
      { label: `إجمالي حصة صاحب العمل ${formatPercent(c.employerRate, 2)}`, value: formatEGP(c.employer), emphasis: true },
      { label: "إجمالي الاشتراك الشهري للطرفين", value: formatEGP(c.employee + c.employer) },
    ];
    notes.push("مش محسوب هنا: صندوق الطوارئ (1% على صاحب العمل في المنشآت 30 عامل فأكثر) واشتراك صندوق الشهداء (0.05%) لأنهم بقوانين منفصلة.");
    return {
      ok: true,
      headline: { label: "بيتخصم من مرتبك شهريًا", value: formatEGP(c.employee), sub: `${formatPercent(c.employeeRate, 2)} من أجر اشتراك ${formatEGP(c.base)}` },
      highlights: [
        { label: "حصة صاحب العمل", value: formatEGP(c.employer) },
        { label: "خصمك في السنة", value: formatEGP(c.employee * 12) },
      ],
      breakdown,
      notes,
    };
  },
};
